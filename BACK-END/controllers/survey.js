const Survey = require("../models/surveys");
const Question = require("../models/questions");
const User = require("../models/users");

const { connectToDatabase } = require("../models/utils/connectDB");
const { insertVoterInfo } = require("./utils/insert");
const { missingElements } = require("./utils/filter");
const { newError } = require("./utils/error");

exports.postSurvey = async (req, res, next) => {
  await connectToDatabase();
  const surveyId = req.params.surveyId;
  const { responses } = req.body;
  const voterKey = "XLXLXLXLXLXL"; // const voterKey = req.user;

  try {
    const survey = await Survey.findById(surveyId)
      .populate("pages.elements")
      .exec();

    if (!survey) throw newError("survey not found", 404);
    if (!responses) throw newError("key error", 400);

    if (missingElements(survey, responses)) {
      throw newError("some necessary questions not responded", 400);
    }

    const insertVoterResult = await insertVoterInfo(
      voterKey,
      surveyId,
      responses
    );

    if (!insertVoterResult) throw newError("already voted", 400);

    for (const response of responses) {
      const question = await Question.findById(response.questionId)
        .select("choices")
        .exec();

      if (!question) continue;

      question.choices.map((choice) => {
        const choiceId = String(choice._id);
        if (response.choiceIds.includes(choiceId)) {
          choice.count++;
        }
        return choice;
      });

      if (!question.count) question.count = 1;
      else question.count++;
      question.save();
    }
    return res.status(201).json({ message: success });
  } catch (error) {
    return res.status(error.code).json({ message: error.message });
  }
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
