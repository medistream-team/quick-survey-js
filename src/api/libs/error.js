exports.logHandler = (err, req, res, next) => {
  console.log("error occured!");
  console.log(`[${new Date()}] : ${err.stack} `);
  next(err);
};

exports.errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message;
  return res.status(status).json({ messge: message });
};
