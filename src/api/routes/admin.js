const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin");

router.post("/survey", adminController.createSurvey);
router.patch("/survey/:surveyId/status", adminController.patchSurvey);

module.exports = router;
