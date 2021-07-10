const tokenService = require("../services/token");

const authenticateUser = async (req, res, next) => {
  try {
    const { user } = req.body;
    const token = await tokenService.createToken(user);
    return res.status(201).json({ token: token });
  } catch (err) {
    return next(err);
  }
};

module.exports = { authenticateUser };
