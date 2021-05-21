const express = require("express");
const router = express.Router();

const surveyController = require("../controllers/survey");

router.get("/:surveyId", surveyController.getSurvey);

module.exports = router;