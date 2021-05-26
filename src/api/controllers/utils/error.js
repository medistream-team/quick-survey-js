exports.newError = (message, statusCode) => {
  const error = new Error(message);
  error.code = statusCode;
  return error;
}