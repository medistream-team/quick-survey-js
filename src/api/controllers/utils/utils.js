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

exports.insertSurveyVoterInfo = async (
  voterKey,
  surveyId,
  answerObjs,
  session
) => {
  if (await User.exists({ userKey: voterKey })) {
    const user = await User.findOne({ userKey: voterKey })
      .select("votedSurvey")
      .session(session);

    const voted = user.votedSurvey.filter((history) => {
      return String(history.surveyId) === surveyId;
    });

    if (voted.length) throwError("already voted", 400);

    user.votedSurvey.push({
      surveyId: surveyId,
      responses: answerObjs,
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
              responses: answerObjs,
            },
          ],
        },
      ],
      { session: session }
    );
  }
};

exports.checkMissingEssentialElements = (survey, answers /**@array */) => {
  const mustElements = [];

  survey.pages.forEach((page) => {
    page.elements.forEach((element) => {
      if (element.isRequired) {
        mustElements.push(String(element._id));
      }
    });
  });
  const respondedElements = answers.map((response) => response.questionId);
  const missingElements = mustElements.filter((element) => {
    return !respondedElements.includes(element);
  });

  if (missingElements.length) {
    throwError("some necessary questions not responded", 400);
  }
  return;
};
