const Question = require("../models/questions/schema");
const surveyDataAccess = require("../models/surveys");
const User = require("../models/users/schema");

const { convertUTCToLocalTime } = require("../utils/date");
const { customError } = require("../utils/custom-errors");
const validator = require("../utils/validators");

const createSurvey = async (userId, pages, hasExpiry, closeAt, isPublic, session) => {
  if (hasExpiry && !closeAt) {
    const error = customError.omissionError("closing time");
    throw error;
  }

  if (!validator.isClosingTimeValid(closeAt)) {
    const error = customError.invalidInputError("closeAt");
    throw error;
  }

  const pageContent = [];

  for (const page of pages) {
    const elements = page.elements.map((element) => {
      if (element.choices.length < 2) {
        const error = customError.omissionError("more than two choices");
        throw error;
      }

      return new Question({
        ...element,
        description: element.description ? element.description : null,
      });
    });

    const questions = await Question.insertMany(elements, {
      session: session,
    });

    pageContent.push({ ...page, elements: questions });
  }

  return await surveyDataAccess.create(
    userId,
    hasExpiry,
    isPublic,
    pageContent,
    closeAt,
    session
  );
};

const voteSurvey = async (surveyId, answers, session) => {
  const survey = await surveyDataAccess.get(surveyId, "pages.elements");

  if (!validator.isSurveyOpen(survey)) {
    const error = customError.forbiddenError("closed survey");
    throw error;
  }

  if (validator.isNecessaryQuestionMissing(survey, answers)) {
    const error = customError.omissionError("necessary questions");
    throw error;
  }

  for await (const answer of answers) {
    const question = await Question.findById(answer.questionId)
      .select(
        "choices responseCount participantCount multipleSelectOption type"
      )
      .session(session);

    for await (const choiceId of answer.choiceIds) {
      if (!validator.isChoiceCorrespondToQuestion(question, choiceId)) {
        const error = customError.notFoundError(
          `question containing choice id ${choiceId}`
        );
        throw error;
      }

      const choice = question.choices.find((choice) => {
        return String(choice._id) === choiceId;
      });

      choice.responseCount++;
      question.responseCount++;
      survey.responseCount++;
    }
    question.participantCount++;
    await question.save();
  }
  survey.participantCount++;
  return await survey.save();
};

const getSurvey = async (userId, surveyId) => {
  const survey = await surveyDataAccess.get(surveyId, "pages.elements");

  survey.createdAt = convertUTCToLocalTime(survey.createdAt);
  survey.closeAt = survey.closeAt
    ? convertUTCToLocalTime(survey.closeAt)
    : null;
  const user = await User.findOne({ userKey: userId }).select("votedSurvey");
  const isAdmin = survey.creatorKey === user ? true : false;
  const voted = validator.isVoted(user, surveyId) ? true : false;
  return { survey: survey, isAdmin: isAdmin, voted: voted };
};

module.exports = { voteSurvey, getSurvey, createSurvey };
