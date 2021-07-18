const mongoose = require("mongoose");

const Survey = require("../models/surveys/schema");
const surveyService = require("../services/survey");
const userService = require("../services/user");

const { connectToDatabase } = require("../libs/mongoose");
const { customError } = require("../utils/custom-errors");

const createSurvey = async (req, res, next) => {
  try {
    await connectToDatabase();

    const user = req.user;
    const session = await mongoose.startSession();
    const { pages, hasExpiry, closeAt, isPublic } = req.body;

    await session.withTransaction(async () => {
      console.log(user);
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
  await connectToDatabase();

  const creatorKey = req.header("authorization");
  const surveyId = req.params.surveyId;
  const { isActive } = req.body;

    const survey = await Survey.findById(surveyId).select(
      "isActive creatorKey"
    );
    if (survey.creatorKey !== creatorKey) {
      const error = customError.unauthorizedError();
      throw error;
    }
    survey.isActive = isActive;
    survey.save();

    return res.status(200).json({ message: "success" });
  } catch (error) {
    return res
      .status(error.code ? error.code : 400)
      .json({ message: error.message });
  }
};

module.exports = { createSurvey, patchSurvey };
