const mongoose = require("mongoose");

const { MONGO_URI } = process.env;

mongoose.Promise = global.Promise;

let isConnected;

// TODO 미들웨어 처리로 수정 필요.
exports.connectToDatabase = () => {
  if (isConnected) {
    console.log("=> using existing database connection");
    return Promise.resolve();
  }

  console.log("=> using new database connection");
  return mongoose
    .connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((db) => {
      isConnected = db.connections[0].readyState;
    });
};
