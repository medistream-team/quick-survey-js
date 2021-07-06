const mongoose = require("mongoose");

const Survey = require("../models/surveys");
const Question = require("../models/questions");

const { connectToDatabase } = require("../models/utils/connectDB");
const {
  throwError,
  convertUTCToLocalTime,
  insertSurveyCreatorInfo,
} = require("./utils/utils");

const {
  validateId,
  validateAuth,
  validateKeyError,
  validateValueError,
  validateReqMultipleSelectOption,
} = require("./utils/validators");

exports.createSurvey = async (req, res, next) => {
  await connectToDatabase();
  const session = await mongoose.startSession();
  const creatorKey = req.header("authorization");

  try {
    validateKeyError(req.body, "pages");
    validateKeyError(req.body, "isPublic");
    validateKeyError(req.body, "hasExpiry");

    const { pages, hasExpiry, closeAt, isPublic } = req.body;

    validateAuth(creatorKey);

    if (hasExpiry && !closeAt) {
      throwError("closing time is required", 400);
    }

    validateValueError(pages, Array);
    validateValueError(hasExpiry, Boolean);
    validateValueError(isPublic, Boolean);

    if (
      closeAt &&
      convertUTCToLocalTime(new Date()) >=
        convertUTCToLocalTime(new Date(closeAt) || isNaN(new Date(closeAt)))
    ) {
      throwError("invalid closing time", 400);
    }

    session.startTransaction();

    let pageObjs = [];
    for (const page of pages) {
      const elements = page.elements.map((element /** @object */) => {
        validateKeyError(element, "type");
        validateKeyError(element, "title");
        validateKeyError(element, "isRequired");
        validateKeyError(element, "multipleSelectOption");
        validateKeyError(element, "choices");

        validateValueError(element.choices, Array);
        validateValueError(element.isRequired, Boolean);
        validateValueError(element.multipleSelectOption, Object);

        if (element.choices.length < 2) {
          throwError("at least two choices are required", 400);
        }

        validateReqMultipleSelectOption(
          element.type,
          element.multipleSelectOption
        );

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

  try {
    validateKeyError(req.body, "isActive");
    const { isActive } = req.body;

    await validateId(surveyId, Survey);
    validateAuth(creatorKey);
    validateValueError(isActive, Boolean);

    const survey = await Survey.findById(surveyId).select(
      "isActive creatorKey"
    );
    if (survey.creatorKey !== creatorKey) {
      throwError("unauthorized", 401);
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
