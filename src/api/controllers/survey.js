const mongoose = require("mongoose");

const Survey = require("../models/surveys");
const Question = require("../models/questions");
const User = require("../models/users");

const { connectToDatabase } = require("../models/utils/connectDB");
const { insertVoterInfo } = require("./utils/insert");
const { missingElements } = require("./utils/filter");
const { newError } = require("./utils/error");

const MULTIPLE_SELECT_ALLOWED_TYPES = {
  checkbox: true,
  rating: false,
};

exports.voteSurvey = async (req, res, next) => {
  await connectToDatabase();
  const session = await mongoose.startSession();

  const surveyId = req.params.surveyId;
  const voterKey = req.header("authorization");
  const { answers } = req.body;

  try {
    if (!Array.isArray(answers)) {
      throw newError("value error", 400);
    }

    if (!mongoose.Types.ObjectId.isValid(surveyId)) {
      throw newError("invalid object id", 400);
    }

    if (!(await Survey.exists({ _id: surveyId }))) {
      throw newError("survey not found", 404);
    }

    if (!voterKey) {
      throw newError("unauthorized", 401);
    }

    if (!answers) throw newError("key error", 400);

    const survey = await Survey.findById(surveyId).populate("pages.elements");

    if (
      !survey.isActive ||
      (survey.closeAt && Date.now() > new Date(String(survey.closeAt)))
    ) {
      throw newError("closed survey", 400);
    }

    if (missingElements(survey, answers) /** @boolean */) {
      throw newError("some necessary questions not responded", 400);
    }

    session.startTransaction();

    for (const answer of answers) {
      if (!("questionId" in answer) || !("choiceIds" in answer)) {
        throw newError("key error", 400);
      }

      if (!Array.isArray(answer.choiceIds)) {
        throw newError("value error", 400);
      }

      if (!mongoose.Types.ObjectId.isValid(answer.questionId)) {
        throw newError("invalid object id", 400);
      }

      if (!(await Question.exists({ _id: answer.questionId }))) {
        throw newError("question not found", 404);
      }

      const question = await Question.findById(answer.questionId)
        .select(
          "choices responseCount participantCount multipleSelectOption type"
        )
        .session(session);

      const multipleSelectOption = question.multipleSelectOption;
      const choicesLength = answer.choiceIds.length;

      if (
        (!MULTIPLE_SELECT_ALLOWED_TYPES[question.type] && choicesLength > 1) ||
        (multipleSelectOption.allowedMin &&
          multipleSelectOption.allowedMax &&
          (multipleSelectOption.allowedMin > choicesLength ||
            multipleSelectOption.allowedMax < choicesLength))
      ) {
        throw newError("invalid selection allowance range", 400);
      }

      answer.choiceIds.forEach((choiceId) => {
        if (!mongoose.Types.ObjectId.isValid(choiceId)) {
          throw newError("invalid object id", 400);
        }
      });

      answer.choiceIds.forEach((choiceId) => {
        const choice = question.choices.find((choiceObj) => {
          return String(choiceObj._id) === choiceId;
        });
        if (!choice) {
          throw newError("choice not found", 400);
        }
        choice.responseCount++;
        question.responseCount++;
        survey.responseCount++;
      });

      question.participantCount++;
      await question.save();
    }
    survey.participantCount++;

    const insertVoterResult = await insertVoterInfo(
      voterKey,
      surveyId,
      answers,
      session
    );

    if (!insertVoterResult /** @boolean or @resolve */)
      throw newError("already voted", 400);

    await survey.save();
    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({ message: "success" });
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
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

  let survey = await Survey.findById(surveyId).populate("pages.elements");

  if (survey.closeAt) {
    survey.closeAt = new Date(survey.closeAt);
  }
  survey.createdAt = new Date(survey.createdAt);

  let isAdmin = false;
  if (survey.creatorKey === userKey) {
    isAdmin = true;
  }

  const user = await User.findOne({ userKey: userKey }).select("votedSurvey");

  let voted = false;
  if (user) {
    const votedSurvey = user.votedSurvey.filter((votedHistory) => {
      return votedHistory.surveyId === surveyId;
    });
    if (votedSurvey.length) {
      voted = true;
    }
  }
  return res
    .status(200)
    .json({ survey: survey, isAdmin: isAdmin, voted: voted });
};
