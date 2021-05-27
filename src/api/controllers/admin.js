const mongoose = require("mongoose");

const Survey = require("../models/surveys");
const Question = require("../models/questions");

const { connectToDatabase } = require("../models/utils/connectDB");
const { insertCreatorInfo } = require("./utils/insert");
const { newError } = require("./utils/error");

const ALLOWED_TYPES = {
  checkbox: true,
  rating: true,
};

exports.createSurvey = async (req, res, next) => {
  await connectToDatabase();
  const session = await mongoose.startSession();

  const creatorKey = req.header("authorization");
  const { pages, hasExpiry, closeAt, isPublic } = req.body;

  try {
    if (!creatorKey) {
      throw newError("unauthorized", 401);
    }

    if (
      !("pages" in req.body) ||
      !("hasExpiry" in req.body) ||
      !("isPublic" in req.body)
    ) {
      throw newError("key error", 400);
    }

    if (hasExpiry && !closeAt) {
      throw newError("closing time is required", 400);
    }

    if (
      !Array.isArray(pages) ||
      typeof hasExpiry !== "boolean" ||
      (closeAt && isNaN(new Date(closeAt))) ||
      typeof isPublic !== "boolean"
    ) {
      throw newError("value error", 400);
    }

    if (closeAt && Date.now() >= new Date(closeAt)) {
      throw newError("invalid closing time", 400);
    }

    session.startTransaction();

    let pageObjs = [];
    for (const page of pages) {
      const elements = page.elements.map((element /** @object */) => {
        if (
          !Array.isArray(element.choices) ||
          typeof element.isRequired !== "boolean" ||
          typeof element.multipleSelectOption !== "object"
        ) {
          throw newError("value error", 400);
        }

        if (
          !("type" in element) ||
          !("title" in element) ||
          !("isRequired" in element) ||
          !("multipleSelectOption" in element) ||
          !("allowed" in element.multipleSelectOption) ||
          !("choices" in element)
        ) {
          throw newError("key error", 400);
        }

        if (!ALLOWED_TYPES[element.type]) {
          throw newError("not allowed question type", 400);
        }

        if (element.choices.length < 2) {
          throw newError("at least two choices are required", 400);
        }

        let multipleSelectOption = element.multipleSelectOption;
        if (
          multipleSelectOption.allowedMin &&
          multipleSelectOption.allowedMax &&
          multipleSelectOption.allowedMin > multipleSelectOption.allowedMax
        ) {
          throw newError("invalid selection allowance range", 400);
        }

        return new Question({
          ...element,
          description: element.description ? element.description : null,
        });
      });

      const insertedQuestions = await Question.insertMany(elements, {
        session: session,
      });

      pageObjs.push({ ...page, elements: insertedQuestions });
    }
    const survey = await Survey.create(
      [
        {
          creatorKey: creatorKey,
          hasExpiry: hasExpiry,
          isPublic: isPublic,
          pages: pageObjs,
          closeAt: closeAt ? closeAt : null,
        },
      ],
      { session: session }
    );

    await insertCreatorInfo(survey, creatorKey, session);

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({ message: "success" });
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    return res
      .status(error.code ? error.code : 400)
      .json({ message: error.message });
  }
};

exports.patchSurvey = async (req, res, next) => {
  await connectToDatabase();
  const creatorKey = req.header("authorization");
  const surveyId = req.params.surveyId;
  const { status } = req.body;

  try {
    if (!creatorKey) {
      throw newError("unauthorized", 401);
    }

    if (!mongoose.Types.ObjectId.isValid(surveyId)) {
      throw newError("invalid object id", 400);
    }

    if (!("status" in req.body)) {
      throw newError("key error", 400);
    }

    if (typeof status !== "boolean") {
      throw newError("value error", 400);
    }

    if (!(await Survey.exists({ _id: surveyId }))) {
      throw newError("survey not found", 404);
    }

    const survey = await Survey.findById(surveyId).select(
      "isActive creatorKey"
    );

    if (survey.creatorKey !== creatorKey) {
      throw newError("unauthorized", 401);
    }

    survey.isActive = status;
    survey.save();

    return res.status(200).json({ message: "success" });
  } catch (error) {
    return res
      .status(error.code ? error.code : 400)
      .json({ message: error.message });
  }
};
