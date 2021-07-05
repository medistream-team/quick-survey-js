const get = (modelSchema, userId, session) => {
  return modelSchema
    .findOne({ userKey: userId })
    .select("votedSurvey")
    .session(session);
};

const create = (modelSchema, userId, answers, session) => {
  return modelSchema.create(
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