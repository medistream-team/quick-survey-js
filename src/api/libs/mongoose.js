const mongoose = require("mongoose");

const { MONGO_URI } = process.env;
const { customError } = require("../utils/custom-errors");

const connectDB = (req, res, next) => {
  try {
    return mongoose
      .connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((db) => {
        return next();
      })
      .catch((err) => {
        throw err;
      });
  } catch (err) {
    const error = customError.databaseConnectionError();
    return res.status(error.status).json({ message: error.message });
  }
};

module.exports = { connectDB };
