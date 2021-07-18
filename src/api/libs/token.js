const tokenService = require("../services/token");

const PATHS_WITH_OPEN_ACCESS = ["/auth/token"];

exports.applyTokenMiddleware = (app) => {
  app.use("/", async (req, res, next) => {
    if (PATHS_WITH_OPEN_ACCESS.includes(req.path)) {
      return next();
    }
    const token = req.header("authorization");
    try {
      req.user = await tokenService.verifyToken(token);
      next();
    } catch (err) {
      next(err);
    }
  });
};
