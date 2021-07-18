const Survey = require("./schema");

const get = (surveyId, populateDoc) => {
  return Survey.findById(surveyId).populate(populateDoc);
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
