const mongoose = require("mongoose");

const Survey = require("../models/surveys");
const User = require("../models/users");

const { connectToDatabase } = require("../models/utils/connectDB");

exports.getSurvey = async (req, res, next) => {
  await connectToDatabase();
  const surveyId = req.params.surveyId;
  const userKey = "FPFPFPFPFPFP"; // const userKey = req.user;

  if (!(await Survey.exists({ _id: surveyId }))) {
    return res.status(404).json({ MESSAGE: "SURVEY NOT FOUND" });
  }

  const survey = await Survey.findById(surveyId).populate("pages.elements");
  const user = await User.findOne({ userKey: userKey }).exec();

  if (user) {
    const votedSurvey = user.votedSurvey.filter((history) => {
      return history.surveyId === surveyId;
    });
    if (votedSurvey) {
      return res.status(200).json({ survey: survey, MESSAGE: "ALREADY VOTED" });
    }
  }
  return res.status(200).json({ survey: survey });
};
