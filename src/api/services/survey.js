const Survey = require("../models/surveys");
const User = require("../models/users");
const { convertUTCToLocalTime, checkIfUserVoted } = require("../utils");

class SurveyService {
  constructor() {}

  async getSurvey(user, surveyId) {
    const survey = await Survey.findById(surveyId).populate("pages.elements");

    survey.createdAt = convertUTCToLocalTime(survey.createdAt);
    survey.closeAt = survey.closeAt
      ? convertUTCToLocalTime(survey.closeAt)
      : null;

    const userData = await User.findOne({ userKey: user }).select(
      "votedSurvey"
    );

    const isAdmin = survey.creatorKey === userData ? true : false;
    const voted = checkIfUserVoted(userData, surveyId) ? true : false;

    return { survey: survey, isAdmin: isAdmin, voted: voted };
  }
}

module.exports = new SurveyService();
