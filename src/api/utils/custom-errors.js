const errorMessage = {
  notFoundError: (property) => {
    return `${property} not found`;
  },
  invalidTypeError: (property) => {
    return `invalid type for ${property}`;
  },
  omissionError: (property) => {
    return `${property} is necessary`;
  },
  forbiddenError: (details) => {
    return `access denied for ${details}`;
  },
  invalidInputError: (property) => {
    return `invalid ${property}`;
  },
  databaseConnectionError: `cannot connect to mongoDB`,
  invalidTokenError: `invalid token`,
  unauthorizedError: `unauthorized access`,
};

const customError = {
  notFoundError: (property) => {
    const error = new Error(errorMessage.notFoundError(property));
    error.status = 404;
    return error;
  },
  invalidTypeError: (property) => {
    const error = new Error(errorMessage.invalidTypeError(property));
    error.status = 400;
    return error;
  },
  omissionError: (property) => {
    const error = new Error(errorMessage.omissionError(property));
    error.status = 400;
    return error;
  },
  forbiddenError: (details) => {
    const error = new Error(errorMessage.forbiddenError(details));
    error.status = 403;
    return error;
  },
  invalidInputError: (property) => {
    const error = new Error(errorMessage.invalidInputError(property));
    error.status = 400;
    return error;
  },
  invalidTokenError: () => {
    const error = new Error(errorMessage.invalidTokenError);
    error.status = 401;
    return error;
  },
  unauthorizedError: () => {
    const error = new Error(errorMessage.unauthorizedError);
    error.status = 401;
    return error;
  },
  databaseConnectionError: () => {
    const error = new Error(errorMessage.databaseConnectionError);
    error.status = 500;
    return error;
  },
};

module.exports = { customError };
