const mongoose = require("mongoose");

const Survey = require("../models/surveys/schema");
const Question = require("../models/questions/schema");

const { connectToDatabase } = require("../libs/mongoose");
const { convertUTCToLocalTime } = require("../utils/date");
const { customError } = require("../utils/custom-errors");

const { insertSurveyCreatorInfo } = require("./utils/utils");

exports.createSurvey = async (req, res, next) => {
  await connectToDatabase();

  const session = await mongoose.startSession();
  const creatorKey = req.header("authorization");

  try {
    const { pages, hasExpiry, closeAt, isPublic } = req.body;

    if (hasExpiry && !closeAt) {
      const error = customError.omissionError("closing time");
      throw error;
    }

    if (
      closeAt &&
      convertUTCToLocalTime(new Date()) >=
        convertUTCToLocalTime(new Date(closeAt) || isNaN(new Date(closeAt)))
    ) {
      const error = customError.invalidInputError("closing time");
      throw error;
    }

    session.startTransaction();

    const pageObjs = [];
    for (const page of pages) {
      const elements = page.elements.map((element /** @object */) => {
        if (element.choices.length < 2) {
          const error = customError.omissionError("more than two choices");
          throw error;
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

    await insertSurveyCreatorInfo(survey, creatorKey, session);
    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({ surveyId: survey[0]._id });
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
  const { isActive } = req.body;

  try {
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
