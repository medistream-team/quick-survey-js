const Survey = require("../models/surveys");
const Question = require("../models/questions");

const { connectToDatabase } = require("../models/utils/connectDB");
const { insertCreatorInfo } = require("./utils/insert");
const { newError } = require("./utils/error");

exports.createSurvey = async (req, res, next) => {
  await connectToDatabase();
  const creatorKey = "AWERASDFASDF"; //req.user;
  const { pages, hasExpiry, closeAt, isPublic } = req.body;

  try {
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
      const insertedQuestions = await Question.insertMany(elements);
      pageObjs.push({ ...page, elements: insertedQuestions });
    }

    let survey = {
      creatorKey: creatorKey,
      hasExpiry: hasExpiry,
      isPublic: isPublic,
      pages: pageObjs,
    };

    if (closeAt) {
      survey = await Survey.create({
        ...survey,
        closeAt: new Date(closeAt),
      });
    } else {
      survey = await Survey.create({
        ...survey,
        closeAt: null,
      });
    }

    await insertCreatorInfo(survey, creatorKey);
    return res.status(201).json({ message: "success" });
  } catch (error) {
    return res.status(error.code).json({ message: error.message });
  }
};
