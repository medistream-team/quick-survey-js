const TokenService = require("../services/token");
const { evadePathForMiddleware } = require("../utils");

const PATHS_WITH_OPEN_ACCESS = ["/auth/token", "/admin/survey"];

exports.applyTokenMiddleware = (app) => {
  app.use("/", async (req, res, next) => {
    await evadePathForMiddleware(PATHS_WITH_OPEN_ACCESS, req.path, next);
    const token = req.header("authorization");
    try {
      req.user = await TokenService.verifyToken(token);
      next();
    } catch (err) {
      next(err);
    }
  });
};
