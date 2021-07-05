const createError = require("http-errors");

const userDataAccess = require("../models/users");
const { checkIfUserVoted } = require("../utils");

const createOrUpdateUser = async (userId, surveyId, answers, session) => {
  const user = await userDataAccess.get(userId, session);

  if (!user) {
    return await userDataAccess.create(userId, surveyId, answers, session);
  }

  if (checkIfUserVoted(user, surveyId)) {
    throw createError(400, "already voted");
  }

  user.votedSurvey.push({
    surveyId: surveyId,
    responses: answers,
  });
  return await user.save();
};

module.exports = { createOrUpdateUser };
