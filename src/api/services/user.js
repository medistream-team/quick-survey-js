const userDataAccess = require("../models/users");

const { customError } = require("../utils/custom-errors");
const validator = require("../utils/validators");

const createOrUpdateVoter = async (userId, surveyId, answers, session) => {
  const user = await userDataAccess.getVoter(userId, session);

  if (!user) {
    return await userDataAccess.createVoter(userId, surveyId, answers, session);
  }

  if (validator.isVoted(user, surveyId)) {
    const error = customError.forbiddenError("already voted survey");
    throw error;
  }

  return await userDataAccess.updateVoter(user, surveyId, answers);
};

const createOrUpdateCreator = async (userId, survey, session) => {
  const user = await userDataAccess.getCreator(userId, session);

  if (!user) {
    return await userDataAccess.createCreator(userId, survey, session);
  }

  return await userDataAccess.updateCreator(user, survey);
};

module.exports = { createOrUpdateVoter, createOrUpdateCreator };
