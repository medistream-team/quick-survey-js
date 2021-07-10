const jwt = require("jsonwebtoken");

const { customError } = require("../utils/custom-errors");
const { SECRET_KEY } = process.env;

const createToken = async (user) => {
  if (!user) {
    const error = customError.omissionError("user id");
    throw error;
  }
  return await jwt.sign({ user: user }, SECRET_KEY);
};

const verifyToken = async (token) => {
  const decoded = await jwt.verify(token, SECRET_KEY);
  if (!decoded.user) {
    const error = customError.invalidTokenError;
    throw error;
  }
  return decoded.user;
};

module.exports = { createToken, verifyToken };
