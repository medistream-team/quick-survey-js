const get = (Schema, surveyId, populateDoc) => {
  return Schema.findById(surveyId).populate(populateDoc);
};

module.exports = { get };