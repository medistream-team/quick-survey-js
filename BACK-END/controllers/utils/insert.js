const User = require("../../models/users");

exports.insertCreatorInfo = (resolveValue, creatorKey) => {
  return User.findOne({ userKey: creatorKey })
    .exec()
    .then((user) => {
      if (!user) {
        return User.create({
          userKey: creatorKey,
          createdSurvey: [
            {
              surveyId: resolveValue._id,
              createdAt: resolveValue.createdAt,
            },
          ],
        });
      }
      user.createdSurvey.push({
        surveyId: resolveValue._id,
        createdAt: resolveValue.createdAt,
      });
      return user.save();
    })
    .catch((error) => {
      console.log(error);
      throw new Error(error);
    });
};

exports.insertVoterInfo = async (voterKey, surveyId, responseObjs) => {
  if (await User.exists({ userKey: voterKey })) {
    const user = await User.findOne({ userKey: voterKey }).exec();
    const voted = user.votedSurvey.filter((history) => {
      return String(history.surveyId) === surveyId;
    });

    if (voted.length) return false;

    user.votedSurvey.push({
      surveyId: surveyId,
      responses: responseObjs,
    });
    user.save();
    
  } else {
    return await User.create({
      userKey: voterKey,
      votedSurvey: [
        {
          surveyId: surveyId,
          responses: responseObjs,
        },
      ],
    });
  }
};
