exports.checkIfUserVoted = async (userData, surveyId) => {
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

exports.evadePathForMiddleware = async (
  /**@array */ evadingPathsArray,
  /**@pathString */ path,
  next
) => {
  if (evadingPathsArray.includes(path)) next();
};
