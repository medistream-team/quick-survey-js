const createError = require("http-errors");

const User = require("../models/users");

class UserService {
  /**
   * 
   * @param {string} user 
   * @param {string} surveyId 
   * @param {object} answer 
   * @param {*} session 
   */
  async createOrUpdateVoter(user, surveyId, answer, session) {
    if (await User.exists({ userKey: user })) {
      const user = await User.findOne({ userKey: user })
        .select("votedSurvey")
        .session(session);

      const voted = user.votedSurvey.filter((history) => {
        return String(history.surveyId) === surveyId;
      });

      if (voted.length) throw createError(400, "already voted");

      user.votedSurvey.push({
        surveyId: surveyId,
        responses: answer,
      });
      await user.save();
    } else {
      return await User.create(
        [
          {
            userKey: user,
            votedSurvey: [
              {
                surveyId: surveyId,
                responses: answer,
              },
            ],
          },
        ],
        { session: session }
      );
    }
  }
}

exports.userService = new UserService();