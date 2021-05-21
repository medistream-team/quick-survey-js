const Survey = require("../models/surveys");
const Question = require("../models/questions");
const User = require("../models/users");

const { connectToDatabase } = require("../models/utils/connectDB");
const { insertVoterInfo } = require("./utils/insert");
const { missingElements } = require("./utils/filter");

exports.postSurvey = async (req, res, next) => {
  await connectToDatabase();
  const surveyId = req.params.surveyId;
  const { responses } = req.body;
  const voterKey = "XLXLXLXLXLXL"; // const voterKey = req.user;
  const survey = await Survey.findById(surveyId)
    .populate("pages.elements")
    .exec();

  if (missingElements(survey, responses)) {
    return res
      .status(400)
      .json({ MESSAGE: "some neccessary questions missing." });
  }

  const insertVoterResult = await insertVoterInfo(
    voterKey,
    surveyId,
    responses
  );

  if (!insertVoterResult)
    return res.status(400).json({ MESSAGE: "ALREADY VOTED" });

  for await (let response of responses) {
    const question = await Question.findById(response.questionId)
      .select("choices")
      .exec();

    question.choices.map((choice) => {
      const choiceId = String(choice._id);
      if (response.choiceIds.includes(choiceId)) {
        choice.count++;
      }
      return choice;
    });
    question.save();
  }
  return res.status(201).json({ MESSAGE: "SUCCESS" });
};

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
