const Question = require("../models/questions/schema");
const surveyDataAccess = require("../models/surveys");
const User = require("../models/users/schema");

const { convertUTCToLocalTime } = require("../utils/date");
const { customError } = require("../utils/custom-errors");
const validator = require("../utils/validators");

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
  await survey.save();
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

module.exports = { voteSurvey, getSurvey };
