const mongoose = require("mongoose");

const Survey = require("../models/surveys");
const Question = require("../models/questions");

const { connectToDatabase } = require("../models/utils/connectDB");
const { insertCreatorInfo } = require("./utils/insert");
const { newError } = require("./utils/error");

exports.createSurvey = async (req, res, next) => {
  await connectToDatabase();
  const creatorKey = "AWERASDFASDF"; //req.user;
  const { pages, hasExpiry, closeAt, isPublic } = req.body;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    if (
      !("pages" in req.body) ||
      !("hasExpiry" in req.body) ||
      !("closeAt" in req.body) ||
      !("isPublic" in req.body)
    ) {
      throw newError("key error", 400);
    }

    let pageObjs = [];

    for (const page of pages) {
      const elements = page.elements.map((element) => {
        if (
          !("type" in element) ||
          !("title" in element) ||
          !("isRequired" in element) ||
          !("multipleSelectOption" in element) ||
          !("choices" in element)
        ) {
          throw newError("key error", 400);
        }
        if (!element.description) {
          return new Question({ ...element, description: null });
        }
        return new Question({ ...element });
      });
      const insertedQuestions = await Question.insertMany(elements, {
        session: session,
      });
      pageObjs.push({ ...page, elements: insertedQuestions });
    }

    let survey = {
      creatorKey: creatorKey,
      hasExpiry: hasExpiry,
      isPublic: isPublic,
      pages: pageObjs,
    };

    if (closeAt) {
      survey = await Survey.create(
        [
          {
            ...survey,
            closeAt: new Date(closeAt),
          },
        ],
        { session: session }
      );
    } else {
      survey = await Survey.create(
        [
          {
            ...survey,
            closeAt: null,
          },
        ],
        { session: session }
      );
    }

    await insertCreatorInfo(survey, creatorKey, session);

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({ message: "success" });
  } catch (error) {
    await session.abortTransaction();
    return res
      .status(error.code ? error.code : 400)
      .json({ message: error.message });
  }
};

exports.patchSurvey = async (req, res, next) => {
  await connectToDatabase();
  const creatorKey = "AWERASDFASDF"; //req.user;
  const surveyId = req.params.surveyId;
  const { status } = req.body;

  try {
    const survey = await Survey.findById(surveyId);
    if (survey.creatorKey !== creatorKey) {
      throw new Error("unauthorized", 401);
    }
    if (typeof status !== "boolean") {
      throw new Error("value error", 400);
    }
    survey.isActive = status;
    survey.save();
    return res.status(200).json({ message: "success" });
  } catch (error) {
    return res.status(error.code).json({ message: error.message });
  }
};
