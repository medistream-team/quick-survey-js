const mongoose = require("mongoose");

const Survey = require("../models/surveys");
const Question = require("../models/questions");
const User = require("../models/users");

const { connectToDatabase } = require("../models/utils/connectDB");
const { insertVoterInfo } = require("./utils/insert");
const { missingElements } = require("./utils/filter");
const { newError } = require("./utils/error");

exports.voteSurvey = async (req, res, next) => {
  await connectToDatabase();
  const session = await mongoose.startSession();

  const surveyId = req.params.surveyId;
  const voterKey = req.header("authorization");
  const { responses } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(surveyId)) {
      throw newError("invalid object id", 400);
    }

    if (!(await Survey.exists({ _id: surveyId }))) {
      throw newError("survey not found", 404);
    }

    if (!voterKey) {
      throw newError("unauthorized", 401);
    }

    if (!responses) throw newError("key error", 400);

    const survey = await Survey.findById(surveyId).populate("pages.elements");

    if (
      !survey.isActive ||
      (survey.closeAt && Date.now() > new Date(survey.closeAt))
    ) {
      throw newError("closed survey", 400);
    }

    if (missingElements(survey, responses) /** @boolean */) {
      throw newError("some necessary questions not responded", 400);
    }

    session.startTransaction();

    const insertVoterResult = await insertVoterInfo(
      voterKey,
      surveyId,
      responses,
      session
    );

    if (!insertVoterResult /** @boolean or @resolve */)
      throw newError("already voted", 400);

    for (const response of responses) {
      if (!mongoose.Types.ObjectId.isValid(response.questionId)) {
        throw newError("invalid object id", 400);
      }
      const question = await Question.findById(response.questionId)
        .select("choices responseCount participantCount")
        .session(session);

      if (!question) continue;

      question.choices.map((choice /** @object */) => {
        if (!response.choiceIds.includes(String(choice._id))) {
          throw newError("question and choice not match", 400);
        }
        choice.responseCount++;
        question.responseCount++;
        survey.responseCount++;
        
        return choice;
      });
      question.participantCount++;
      await question.save();
    }
    survey.participantCount++;
    await survey.save();

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({ message: "success" });
  } catch (error) {
    await session.abortTransaction();
    return res
      .status(error.code ? error.code : 400)
      .json({ message: error.message });
  }
};

exports.getSurvey = async (req, res, next) => {
  await connectToDatabase();

  const surveyId = req.params.surveyId;
  const userKey = req.header("authorization");

  if (!mongoose.Types.ObjectId.isValid(surveyId)) {
    return res.status(400).json({ message: "invalid object id" });
  }

  if (!(await Survey.exists({ _id: surveyId }))) {
    return res.status(404).json({ message: "survey not found" });
  }

  const survey = await Survey.findById(surveyId).populate("pages.elements");

  if (new Date() >= new Date(survey.closeAt)) {
    survey.isActive = false;
    survey.save();
  }

  if (!survey.isPublic && !survey.isActive && survey.creatorKey !== userKey) {
    return res.status(200).json({ message: "closed survey" });
  }

  const user = await User.findOne({ userKey: userKey }).select("votedSurvey");

  if (user) {
    const votedSurvey = user.votedSurvey.filter((history) => {
      return history.surveyId === surveyId;
    });
    if (votedSurvey) {
      return res.status(200).json({ survey: survey, message: "already voted" });
    }
  }
  return res.status(200).json({ survey: survey });
};
