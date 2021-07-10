const userDataAccess = require("../models/users");

const { customError } = require("../utils/custom-errors");
const validator = require("../utils/validators");

const createOrUpdateUser = async (userId, surveyId, answers, session) => {
  const user = await userDataAccess.get(userId, session);

  if (!user) {
    return await userDataAccess.create(userId, surveyId, answers, session);
  }

  if (validator.isVoted(user, surveyId)) {
    const error = customError.forbiddenError("already voted survey");
    throw error;
  }

  user.votedSurvey.push({
    surveyId: surveyId,
    responses: answers,
  });
  return await user.save();
};

module.exports = { createOrUpdateUser };
