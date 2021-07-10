// TODO 
// 곧 제거될 파일.
// db access 작업 단위로 함수 분산 필요. 

const User = require("../../models/users");

exports.insertSurveyCreatorInfo = async (surveyObj, creatorKey, session) => {
  if (await User.exists({ userKey: creatorKey })) {
    const user = await User.findOne({ userKey: creatorKey })
      .select("createdSurvey")
      .session(session);

    user.createdSurvey.push({
      surveyId: surveyObj._id,
      createdAt: surveyObj.createdAt,
    });
    return await user.save();
  }

  return await User.create(
    [
      {
        userKey: creatorKey,
        createdSurvey: [
          {
            surveyId: surveyObj._id,
            createdAt: surveyObj.createdAt,
          },
        ],
      },
    ],
    { session: session }
  );
};
