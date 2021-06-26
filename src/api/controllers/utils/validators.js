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
