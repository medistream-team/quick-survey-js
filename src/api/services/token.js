const jwt = require("jsonwebtoken");

const { throwCustomError } = require("../utils");
const { SECRET_KEY } = process.env;

class TokenService {
  async createToken(user) {
    return jwt.sign({ user: user }, SECRET_KEY);
  }

  async verifyToken(token) {
    await jwt.verify(token, SECRET_KEY, (err, payload) => {
      if (err) throwCustomError(err.message, 400);
      return payload;
    });
  }
}

module.exports = new TokenService();
