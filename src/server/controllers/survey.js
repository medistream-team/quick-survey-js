const mongoose = require("mongoose");

const Survey = require("../models/surveys");
const Question = require("../models/questions");
const User = require("../models/users");

const { connectToDatabase } = require("../models/utils/connectDB");
const { insertVoterInfo } = require("./utils/insert");
const { missingElements } = require("./utils/filter");
const { newError } = require("./utils/error");

exports.postSurvey = async (req, res, next) => {
  await connectToDatabase();

  const surveyId = req.params.surveyId;
  const { responses } = req.body;
  const voterKey = "G1jPHapA/H/uE4Gh1"; // const voterKey = req.user;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const survey = await Survey.findById(surveyId).populate("pages.elements");

    if (!survey) throw newError("survey not found", 404);
    if (!responses) throw newError("key error", 400);

    if (missingElements(survey, responses)) {
      throw newError("some necessary questions not responded", 400);
    }

    const insertVoterResult = await insertVoterInfo(
      voterKey,
      surveyId,
      responses,
      session
    );

    if (!insertVoterResult) throw newError("already voted", 400);

    for (const response of responses) {
      const question = await Question.findById(response.questionId)
        .select("choices count")
        .session(session);

      if (!question) continue;

      question.choices.map((choice) => {
        const choiceId = String(choice._id);
        if (response.choiceIds.includes(choiceId)) {
          choice.count++;
          question.count++;
        }
        return choice;
      });
      await question.save();
    }
    survey.count++;
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

  const user = await User.findOne({ userKey: userKey }).exec();

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
