const tokenService = require("../services/token");

const authenticateUser = async (req, res, next) => {
  const { user } = req.body;

  try {
    const token = await tokenService.createToken(user);
    return res.status(201).json({ token: token });
  } catch (err) {
    return next(err);
  }
};

module.exports = { authenticateUser };
