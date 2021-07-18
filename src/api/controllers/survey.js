const mongoose = require("mongoose");

const surveyService = require("../services/survey");
const userService = require("../services/user");

const voteSurvey = async (req, res, next) => {
  try {
    const session = await mongoose.startSession();
    const user = req.user;
    const { answers } = req.body;
    const surveyId = req.params.surveyId;

    await session.withTransaction(async () => {
      await surveyService.voteSurvey(surveyId, answers, session);
      await userService.createOrUpdateVoter(user, surveyId, answers, session);
    });
    return res.status(200).json({ message: "success" });
  } catch (err) {
    return next(err);
  }
};

const getSurvey = async (req, res, next) => {
  try {
    const surveyId = req.params.surveyId;
    const user = req.header("authorization");

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
