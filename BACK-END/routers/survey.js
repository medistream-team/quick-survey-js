const express = require("express");
const router = express.Router();

const surveyController = require("../controllers/survey");

router.get("/:surveyId", surveyController.getSurvey);
router.post("/:surveyId", surveyController.postSurvey);

module.exports = router;
