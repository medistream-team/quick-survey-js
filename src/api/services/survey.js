const Question = require("../models/questions/schema");
const surveyDataAccess = require("../models/surveys");
const User = require("../models/users/schema");

const { customError } = require("../utils/custom-errors");

const {
  convertUTCToLocalTime,
  checkIfUserVoted,
  findMissingEssentialQuestions,
  validateSelectedChoices,
} = require("../utils");

const voteSurvey = async (surveyId, answers, session) => {
  const survey = await surveyDataAccess.get(surveyId, "pages.elements");

  if (
    !survey.isActive ||
    (survey.closeAt &&
      convertUTCToLocalTime(new Date()) > convertUTCToLocalTime(survey.closeAt))
  ) {
    const error = customError.forbiddenError("closed survey");
    throw error;
  }

  if (findMissingEssentialQuestions(survey, answers)) {
    const error = customError.omissionError("necessary questions");
    throw error;
  }

  for await (const answer of answers) {
    const question = await Question.findById(answer.questionId)
      .select(
        "choices responseCount participantCount multipleSelectOption type"
      )
      .session(session);

    // validateSelectedChoices(
    //   question.type,
    //   question.multipleSelectOption,
    //   answer.choiceIds.length
    // );

    for await (const choiceId of answer.choiceIds) {
      const choice = question.choices.find((choiceObj) => {
        return String(choiceObj._id) === choiceId;
      });
      if (!choice) {
        const error = customError.notFoundError(
          `question containing choice id ${choiceId}`
        );
        throw error;
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
  const survey = await surveyDataAccess.get(surveyId, "pages.elements");

  survey.createdAt = convertUTCToLocalTime(survey.createdAt);
  survey.closeAt = survey.closeAt
    ? convertUTCToLocalTime(survey.closeAt)
    : null;
  const user = await User.findOne({ userKey: user }).select("votedSurvey");
  const isAdmin = survey.creatorKey === user ? true : false;
  const voted = checkIfUserVoted(user, surveyId) ? true : false;
  return { survey: survey, isAdmin: isAdmin, voted: voted };
};

module.exports = { voteSurvey, getSurvey };
