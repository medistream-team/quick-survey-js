const mongoose = require("mongoose");

const Survey = require("../models/surveys");
const Question = require("../models/questions");
const surveyService = require("../services/survey");

const { connectToDatabase } = require("../models/utils/connectDB");

const {
  throwError,
  convertUTCToLocalTime,
  insertSurveyVoterInfo,
  checkMissingEssentialElements,
} = require("./utils/utils");

const {
  validateId,
  validateAuth,
  validateKeyError,
  validateValueError,
  validateReqMultipleSelectOption,
} = require("./utils/validators");

exports.voteSurvey = async (req, res, next) => {
  await connectToDatabase();
  const session = await mongoose.startSession();

  const surveyId = req.params.surveyId;
  const voterKey = req.header("authorization");

  try {
    validateKeyError(req.body, "answers");
    const { answers } = req.body;

    await validateId(surveyId, Survey);
    validateAuth(voterKey);
    validateValueError(answers, Array);

    const survey = await Survey.findById(surveyId).populate("pages.elements");

    if (
      !survey.isActive ||
      (survey.closeAt &&
        convertUTCToLocalTime(new Date()) >
          convertUTCToLocalTime(survey.closeAt))
    ) {
      throwError("closed survey", 400);
    }
    checkMissingEssentialElements(survey, answers);

    session.startTransaction();
    for await (const answer of answers) {
      validateKeyError(answer, "questionId");
      validateKeyError(answer, "choiceIds");
      await validateId(answer.questionId, Question);
      validateValueError(answer.choiceIds, Array);

      const question = await Question.findById(answer.questionId)
        .select(
          "choices responseCount participantCount multipleSelectOption type"
        )
        .session(session);

      validateReqMultipleSelectOption(
        question.type,
        question.multipleSelectOption,
        answer.choiceIds.length
      );

      for await (const choiceId of answer.choiceIds) {
        await validateId(choiceId);

        const choice = question.choices.find((choiceObj) => {
          return String(choiceObj._id) === choiceId;
        });
        if (!choice) {
          throwError("choice belonging to a given question not found", 400);
        }
        choice.responseCount++;
        question.responseCount++;
        survey.responseCount++;
      }

      question.participantCount++;
      await question.save();
    }
    survey.participantCount++;

    await insertSurveyVoterInfo(voterKey, surveyId, answers, session);
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
  const user = req.header("authorization");

  const { survey, isAdmin, voted } = await surveyService.getSurvey(
    user,
    surveyId
  );
  return res
    .status(200)
    .json({ survey: survey, isAdmin: isAdmin, voted: voted });
};
