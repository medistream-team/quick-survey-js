const createError = require("http-errors");

const Question = require("../models/questions/schema");
const SurveySchema = require("../models/surveys/schema");
const surveyDataAccess = require("../models/surveys");
const User = require("../models/users/schema");

const {
  convertUTCToLocalTime,
  checkIfUserVoted,
  findMissingEssentialQuestions,
  validateSelectedChoices,
} = require("../utils");

const voteSurvey = async (surveyId, answers, session) => {
  const survey = await surveyDataAccess.get(
    SurveySchema,
    surveyId,
    "pages.elements"
  );

  if (
    !survey.isActive ||
    (survey.closeAt &&
      convertUTCToLocalTime(new Date()) > convertUTCToLocalTime(survey.closeAt))
  ) {
    throw createError(400, "closed survey");
  }

  if (findMissingEssentialQuestions(survey, answers)) {
    throw createError(404, "some neccessary questions not answered");
  }

  for await (const answer of answers) {
    const question = await Question.findById(answer.questionId)
      .select(
        "choices responseCount participantCount multipleSelectOption type"
      )
      .session(session);

    validateSelectedChoices(
      question.type,
      question.multipleSelectOption,
      answer.choiceIds.length
    );

    for await (const choiceId of answer.choiceIds) {
      const choice = question.choices.find((choiceObj) => {
        return String(choiceObj._id) === choiceId;
      });
      if (!choice) {
        throw createError(
          400,
          "choice belonging to a given question not found"
        );
      }
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

const getSurvey = async (user, surveyId) => {
  const survey = await surveyDataAccess.get(
    SurveySchema,
    surveyId,
    "pages.elements"
  );

  survey.createdAt = convertUTCToLocalTime(survey.createdAt);
  survey.closeAt = survey.closeAt
    ? convertUTCToLocalTime(survey.closeAt)
    : null;
  const userData = await User.findOne({ userKey: user }).select("votedSurvey");
  const isAdmin = survey.creatorKey === userData ? true : false;
  const voted = checkIfUserVoted(userData, surveyId) ? true : false;
  return { survey: survey, isAdmin: isAdmin, voted: voted };
};

module.exports = { voteSurvey, getSurvey };
