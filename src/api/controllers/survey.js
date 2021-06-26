const mongoose = require("mongoose");
const createError = require("http-errors");

const { surveyService } = require("../services/survey");
const { connectToDatabase } = require("../models/utils/connectDB");

exports.voteSurvey = async (req, res, next) => {
  await connectToDatabase();
  const session = await mongoose.startSession();
  const surveyId = req.params.surveyId;

  try {
    const { answers } = req.body;

    session.startTransaction();
    await surveyService.voteSurvey(surveyId, answers, session);
    await session.commitTransaction();
    session.endSession();
    return res.status(200).json({ message: "success" });
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    next(error);
  }
};

exports.getSurvey = async (req, res, next) => {
  await connectToDatabase();

  const surveyId = req.params.surveyId;
  const user = req.header("authorization");

  const { survey, isAdmin, voted } = await surveyService.getSurvey(
    user,
    surveyId
  );
  return res
    .status(200)
    .json({ survey: survey, isAdmin: isAdmin, voted: voted });
};
