const mongoose = require("mongoose");

const surveyService = require("../services/survey");
const userService = require("../services/user");
const { connectToDatabase } = require("../libs/mongoose");

const voteSurvey = async (req, res, next) => {
  await connectToDatabase();
  const session = await mongoose.startSession();

  const user = req.user;
  const { answers } = req.body;
  const surveyId = req.params.surveyId;

  try {
    await session.withTransaction(async () => {
      await surveyService.voteSurvey(surveyId, answers, session);
      await userService.createOrUpdateUser(user, surveyId, answers, session);
    });
    return res.status(200).json({ message: "success" });
  } catch (err) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    return next(err);
  }
};

const getSurvey = async (req, res, next) => {
  await connectToDatabase();

  const surveyId = req.params.surveyId;
  const user = req.header("authorization");

  try {
    const { survey, isAdmin, voted } = await surveyService.getSurvey(
      user,
      surveyId
    );

    return res
      .status(200)
      .json({ survey: survey, isAdmin: isAdmin, voted: voted });
  } catch (err) {
    return next(err);
  }
};

module.exports = { voteSurvey, getSurvey };
