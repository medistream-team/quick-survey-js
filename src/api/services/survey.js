const createError = require("http-errors");

const Question = require("../models/questions");
const Survey = require("../models/surveys");
const User = require("../models/users");

const { userService } = require("./user");

const {
  convertUTCToLocalTime,
  checkIfUserVoted,
  findMissingEssentialQuestions,
  validateSelectedChoices,
} = require("../utils");

class SurveyService {
  constructor() {}

  async voteSurvey(surveyId, answers, session) {
    const survey = await Survey.findById(surveyId).populate("pages.elements");

    if (
      !survey.isActive ||
      (survey.closeAt &&
        convertUTCToLocalTime(new Date()) >
          convertUTCToLocalTime(survey.closeAt))
    ) {
      throw createError(400, "closed survey");
    }

    if (findMissingEssentialQuestions(survey, answers)) {
      throw createError(404, "some neccessary questions not answered");
    }

    for await (const answer of answers) {
      const question = await Question.findById(answer.questionId)
        .select(
          "choices responseCount participantCount multipleSelectOption type"
        )
        .session(session);

      validateSelectedChoices(
        question.type,
        question.multipleSelectOption,
        answer.choiceIds.length
      );

      for await (const choiceId of answer.choiceIds) {
        const choice = question.choices.find((choiceObj) => {
          return String(choiceObj._id) === choiceId;
        });
        if (!choice) {
          throw createError(
            400,
            "choice belonging to a given question not found"
          );
        }
        choice.responseCount++;
        question.responseCount++;
        survey.responseCount++;
      }

      question.participantCount++;
      await question.save();
    }
    survey.participantCount++;
    await survey.save();
    await userService.createOrUpdateVoter(voterKey, surveyId, answers, session);
  }

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

exports.surveyService = new SurveyService();
