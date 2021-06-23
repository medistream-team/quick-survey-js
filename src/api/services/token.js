const jwt = require("jsonwebtoken");

const { throwCustomError } = require("../utils");
const { SECRET_KEY } = process.env;

class TokenService {
  async createToken(user) {
    try {
      return jwt.sign({ user: user }, SECRET_KEY);
    } catch (err) {
      throwCustomError(err.message, 400);
    }
  }

  async verifyToken(token) {
    try {
      const decoded = await jwt.verify(token, SECRET_KEY);
      if (!decoded.user) {
        throwCustomError("invalid payload", 400);
      }
      return decoded.user;
    } catch (err) {
      throwCustomError(err.message, 400);
    }
  }
}

module.exports = new TokenService();
