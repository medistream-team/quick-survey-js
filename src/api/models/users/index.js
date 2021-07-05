const User = require("./schema");

const get = (userId, session) => {
  return User.findOne({ userKey: userId })
    .select("votedSurvey")
    .session(session);
};

const create = (userId, surveyId, answers, session) => {
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

module.exports = { get, create };
