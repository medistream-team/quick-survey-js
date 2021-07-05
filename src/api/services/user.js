const createError = require("http-errors");

const UserSchema = require("../models/users/schema");
const userDataAccess = require("../models/users");
const { checkIfUserVoted } = require("../utils");

const createOrUpdateUser = async (userId, surveyId, answers, session) => {
  const user = await userDataAccess.get(UserSchema, userId, session);

  if (!user) {
    return await userDataAccess.create(
      UserSchema,
      userId,
      surveyId,
      answers,
      session
    );
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
