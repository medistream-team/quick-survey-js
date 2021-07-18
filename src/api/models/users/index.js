const User = require("./schema");

const getVoter = (userId, session) => {
  return User.findOne({ userKey: userId })
    .select("votedSurvey")
    .session(session);
};

const createVoter = (userId, surveyId, answers, session) => {
  return User.create(
    [
      {
        userKey: userId,
        votedSurvey: [
          {
            surveyId: surveyId,
            responses: answers,
          },
        ],
      },
    ],
    { session: session }
  );
};

const updateVoter = async (user, surveyId, answers) => {
  user.votedSurvey.push({
    surveyId: surveyId,
    responses: answers,
  });
  return await user.save();
}

const getCreator = (userId, session) => {
  return User.findOne({ userKey: userId })
    .select("createdSurvey")
    .session(session);
};

const createCreator = (userId, survey, session) => {
  return User.create(
    [
      {
        userKey: userId,
        createdSurvey: [
          {
            surveyId: survey._id,
            createdAt: survey.createdAt,
          },
        ],
      },
    ],
    { session: session }
  );
}

const updateCreator = async (user, survey) => {
  user.createdSurvey.push({
    surveyId: survey._id,
    createdAt: survey.createdAt,
  });
  return await user.save();
}

module.exports = {
  getVoter,
  createVoter,
  updateVoter,
  getCreator,
  createCreator,
  updateCreator
}