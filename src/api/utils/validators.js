const { convertUTCToLocalTime } = require("./date");

const isClosingTimeValid = (closeAt) => {
  const now = convertUTCToLocalTime(new Date());
  const closingTime = convertUTCToLocalTime(new Date(closeAt));
  const isInvalidType = isNaN(new Date(closeAt));

  const isClosingTimePast = now >= closingTime;

  if (isClosingTimePast || isInvalidType) {
    return false;
  }
  return true;
};

const isSurveyOpen = (survey) => {
  const isActive = survey.isActive;
  const isTerminated =
    survey.closeAt &&
    convertUTCToLocalTime(new Date()) > convertUTCToLocalTime(survey.closeAt);

  if (!isActive || isTerminated) {
    return false;
  }
  return true;
};

const isVoted = (user, surveyId) => {
  if (!user) {
    return false;
  }
  return user.votedSurvey.find((survey) => {
    return String(survey.surveyId) === surveyId;
  });
};

const isNecessaryQuestionMissing = (survey, answers) => {
  const necessaryQuestionIds = [];

  survey.pages.forEach((page) => {
    page.elements.forEach((question) => {
      if (question.isRequired) {
        necessaryQuestionIds.push(String(question._id));
      }
    });
  });

  const answeredQuestionIds = answers.map((answer) => {
    return answer.questionId;
  });

  return necessaryQuestionIds.some((questionId) => {
    return !answeredQuestionIds.includes(questionId);
  });
};

const isChoiceCorrespondToQuestion = (question, choiceId) => {
  return question.choices.find((choice) => {
    return String(choice._id) === choiceId;
  });
};

module.exports = {
  isClosingTimeValid,
  isSurveyOpen,
  isVoted,
  isNecessaryQuestionMissing,
  isChoiceCorrespondToQuestion,
};
