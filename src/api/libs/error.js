exports.errorHandler = (app) => {
  app.use((req, res, next) => {
    try {
      next();
    } catch (error) {
      const status = error.status || 500;
      const message = error.message;
      return res.status(status).json({ messge: message });
    }
  });
};
