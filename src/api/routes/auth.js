const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth");

router.post("/token", authController.authenticateUser);

module.exports = router;