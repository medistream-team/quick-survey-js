const jwt = require("jsonwebtoken");
const createError = require("http-errors");

const { SECRET_KEY } = process.env;

class TokenService {
  async createToken(user) {
    try {
      return jwt.sign({ user: user }, SECRET_KEY);
    } catch (err) {
      throw createError(400, err.message);
    }
  }

  async verifyToken(token) {
    try {
      const decoded = await jwt.verify(token, SECRET_KEY);
      if (!decoded.user) {
        throw createError(400, "invalid payload");
      }
      return decoded.user;
    } catch (err) {
      throw createError(400, err.message);
    }
  }
}

module.exports = new TokenService();
