const mongoose = require("mongoose");

const { throwError } = require("./utils");

exports.validateAuth = (userKey) => {
  if (!userKey) throwError("unauthorized", 401);
};

exports.validateId = async (pathParameter, modelClass = null) => {
  let message;
  let statusCode;

  if (!(await mongoose.Types.ObjectId.isValid(pathParameter))) {
    message = "invalid object id";
    statusCode = 400;
  } else if (modelClass && !(await modelClass.exists({ _id: pathParameter }))) {
    message = `${modelClass.modelName} not found`;
    statusCode = 404;
  }
  if (!message && !statusCode) return;
  throwError(message, statusCode);
};

exports.validateKeyError = (object, key /**@string */) => {
  if (key in object) return;
  throwError("key error", 400);
};

exports.validateValueError = (data, expectedValue /** @constructor */) => {
  if (expectedValue === Array && !Array.isArray(data)) {
    return throwError("value error", 400);
  }

  if (data.constructor !== expectedValue) {
    return throwError("value error", 400);
  }
};

exports.validateReqMultipleSelectOption = (
  questionType /**@string */,
  multipleSelectOption /**@object */,
  reqSelectionArrayLength = null
) => {
  const MULTIPLE_SELECT_ALLOWED_TYPES = {
    checkbox: true,
    rating: false,
  };

  let notAllowedType;
  let invalidSelectRange;
  let invalidOptionForType;
  let selectOutOfRange;
  let minBiggerThanMax;

  notAllowedType = !(questionType in MULTIPLE_SELECT_ALLOWED_TYPES);

  invalidOptionForType =
    !MULTIPLE_SELECT_ALLOWED_TYPES[questionType] &&
    multipleSelectOption.allowed;

  invalidSelectRange = reqSelectionArrayLength
    ? !MULTIPLE_SELECT_ALLOWED_TYPES[questionType] &&
      reqSelectionArrayLength > 1
    : false;

  if (multipleSelectOption.allowedMin && multipleSelectOption.allowedMax) {
    selectOutOfRange = reqSelectionArrayLength
      ? multipleSelectOption.allowedMin > reqSelectionArrayLength ||
        multipleSelectOption.allowedMax < reqSelectionArrayLength
      : false;

    minBiggerThanMax =
      multipleSelectOption.allowedMin > multipleSelectOption.allowedMax;
  }

  if (
    notAllowedType ||
    invalidSelectRange ||
    invalidOptionForType ||
    selectOutOfRange ||
    minBiggerThanMax
  ) {
    return throwError("invalid selection allowance", 400);
  }
  return;
};
