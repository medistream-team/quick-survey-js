const TokenService = require("../services/token");

exports.authenticateUser = async (req, res, next) => {
  const { user } = req.body;
  const token = await TokenService.createToken(user);
  return res.status(201).json({ token: token });
};