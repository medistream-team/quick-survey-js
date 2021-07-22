const Survey = require("./schema");

const get = (surveyId, options) => {
  const { selectOption, populateOption } = options;

  if (!populateOption) {
    return Survey.findById(surveyId).select(selectOption);
  }

  return Survey.findById(surveyId)
    .select(selectOption)
    .populate(populateOption);
};

const create = (userId, hasExpiry, isPublic, pageContent, closeAt, session) => {
  return Survey.create(
    [
      {
        creatorKey: userId,
        hasExpiry: hasExpiry,
        isPublic: isPublic,
        pages: pageContent,
        closeAt: closeAt ? closeAt : null,
      },
    ],
    { session: session }
  );
};

module.exports = { get, create };
