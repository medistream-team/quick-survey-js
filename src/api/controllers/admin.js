const mongoose = require("mongoose");

const Survey = require("../models/surveys/schema");
const surveyService = require("../services/survey");
const userService = require("../services/user");

const { customError } = require("../utils/custom-errors");

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
    console.log("header에 담긴 키: ", creatorKey);
    if (!creatorKey) {
      throw newError("unauthorized", 401);
    }

    if (!mongoose.Types.ObjectId.isValid(surveyId)) {
      throw newError("invalid object id", 400);
    }

    if (!("isActive" in req.body)) {
      throw newError("key error", 400);
    }

    if (typeof isActive !== "boolean") {
      throw newError("value error", 400);
    }

    if (!(await Survey.exists({ _id: surveyId }))) {
      throw newError("survey not found", 404);
    }

    const survey = await Survey.findById(surveyId).select(
      "isActive creatorKey"
    );
    console.log("설문의 생성자 key: ", survey.creatorKey);
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
