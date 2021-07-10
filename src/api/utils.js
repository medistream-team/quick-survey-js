const createError = require("http-errors");

exports.checkIfUserVoted = async (userData, surveyId) => {
  if (!userData) {
    return false;
  }
  return userData.votedSurvey.find((votedSurvey) => {
    return String(votedSurvey.surveyId) === surveyId;
  });
};

exports.convertUTCToLocalTime = (date) => {
  date.setHours(date.getHours() + 9);
  return date;
};

exports.throwCustomError = (message, statusCode) => {
  const error = new Error(message);
  error.code = statusCode;
  throw error;
};

/**
 *
 * @param {array} evadingPathsArray
 * @param {string} path
 */

exports.evadePathForMiddleware = (evadingPathsArray, path, next) => {
  if (evadingPathsArray.includes(path)) next();
};

/**
 *
 * @param {object} survey
 * @param {array} answers
 * @returns {boolean}
 */

exports.findMissingEssentialQuestions = (survey, answers) => {
  const mustAnswerQuestionIds = [];

  survey.pages.forEach((page) => {
    page.elements.forEach((question) => {
      if (question.isRequired) {
        mustAnswerQuestionIds.push(String(question._id));
      }
    });
  });
  const answeredQuestionIds = answers.map((answer) => answer.questionId);
  mustAnswerQuestionIds.forEach((questionId) => {
    if (!answeredQuestionIds.includes(questionId)) {
      return true;
    } else {
      return false;
    }
  });
};

/**
 *
 * @param {string} questionType
 * @param {object} multipleSelectOption
 * @param {number} selectedChoicesCount
 */

exports.validateSelectedChoices = (
  questionType,
  multipleSelectOption,
  selectedChoicesCount = 0
) => {
  const MULTIPLE_SELECT_ALLOWED_QUESTION_TYPES = {
    checkbox: true,
    rating: false,
  };

  const notAllowedQuestionType = !(
    questionType in MULTIPLE_SELECT_ALLOWED_QUESTION_TYPES
  );

  const invalidOptionForType =
    MULTIPLE_SELECT_ALLOWED_QUESTION_TYPES[questionType] !==
    multipleSelectOption.allowed;

  const invalidSelectRange =
    selectedChoicesCount > 1 &&
    MULTIPLE_SELECT_ALLOWED_QUESTION_TYPES[questionType]
      ? false
      : true;

  let selectOutOfRange;

  if (multipleSelectOption.allowedMin && multipleSelectOption.allowedMax) {
    selectOutOfRange = selectedChoicesCount
      ? multipleSelectOption.allowedMin > selectedChoicesCount ||
        multipleSelectOption.allowedMax < selectedChoicesCount
      : false;
  }

  if (
    notAllowedQuestionType ||
    invalidSelectRange ||
    invalidOptionForType ||
    selectOutOfRange
  ) {
    throw createError(400, "invalid selection allowance");
  }
  return;
};
