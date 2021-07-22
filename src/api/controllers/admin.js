const mongoose = require("mongoose");

const surveyService = require("../services/survey");
const userService = require("../services/user");

const createSurvey = async (req, res, next) => {
  try {
    const user = req.user;
    const session = await mongoose.startSession();
    const { pages, hasExpiry, closeAt, isPublic } = req.body;

    await session.withTransaction(async () => {
      const survey = await surveyService.createSurvey(
        user,
        pages,
        hasExpiry,
        closeAt,
        isPublic,
        session
      );
      await userService.createOrUpdateCreator(user, survey);
      return res.status(201).json({ surveyId: survey[0]._id });
    });
  } catch (err) {
    return next(err);
  }
};

const patchSurvey = async (req, res, next) => {
  try {
    const user = req.user;
    const { surveyId } = req.params;
    const { isActive } = req.body;

    await surveyService.patchSurvey(user, surveyId, isActive);

    return res.status(200).json({ message: "success" });
  } catch (err) {
    return next(err);
  }
};

module.exports = { createSurvey, patchSurvey };
