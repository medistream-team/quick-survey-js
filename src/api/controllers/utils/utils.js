const User = require("../../models/users");

const throwError = (message, statusCode) => {
  const error = new Error(message);
  error.code = statusCode;
  throw error;
};

exports.throwError = throwError;

exports.convertUTCToLocalTime = (date) => {
  date.setHours(date.getHours() + 9);
  return date;
};

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
