const get = (Schema, userId, session) => {
  return Schema.findOne({ userKey: userId })
    .select("votedSurvey")
    .session(session);
};

const create = (Schema, userId, surveyId, answers, session) => {
  return Schema.create(
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
