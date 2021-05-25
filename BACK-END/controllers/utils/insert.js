const User = require("../../models/users");

exports.insertCreatorInfo = async (resolveValue, creatorKey, session) => {
  if (await User.exists({ userKey: creatorKey })) {
    const user = await User.findOne({ userKey: creatorKey })
      .select("createdSurvey")
      .session(session);

    user.createdSurvey.push({
      surveyId: resolveValue._id,
      createdAt: resolveValue.createdAt,
    });

    return await user.save();
  }

  return await User.create(
    [
      {
        userKey: creatorKey,
        createdSurvey: [
          {
            surveyId: resolveValue._id,
            createdAt: resolveValue.createdAt,
          },
        ],
      },
    ],
    { session: session }
  );
};

exports.insertVoterInfo = async (voterKey, surveyId, responseObjs, session) => {
  if (await User.exists({ userKey: voterKey })) {
    const user = await User.findOne({ userKey: voterKey }).session(session);
    const voted = user.votedSurvey.filter((history) => {
      return String(history.surveyId) === surveyId;
    });

    if (voted.length) return false;

    user.votedSurvey.push({
      surveyId: surveyId,
      responses: responseObjs,
    });
    await user.save();
  } else {
    return await User.create(
      [
        {
          userKey: voterKey,
          votedSurvey: [
            {
              surveyId: surveyId,
              responses: responseObjs,
            },
          ],
        },
      ],
      { session: session }
    );
  }
};
