const Survey = require("./schema");

const get = (surveyId, populateDoc) => {
  return Survey.findById(surveyId).populate(populateDoc);
};

module.exports = { get };
