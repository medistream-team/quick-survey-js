const Survey = require("../models/surveys");
const Question = require("../models/questions");

const { connectToDatabase } = require("../models/utils/connectDB");
const { insertCreatorInfo } = require("./utils/insert");

exports.createSurvey = async (req, res, next) => {
  await connectToDatabase();
  const creatorKey = "AWERASDFASDF";
  const { hasExpiry, closeAt, isPublic } = req.body;
  const pages = req.body.pages;

  pages.forEach((page, pagesIdx) => {
    const pageTitle = page.title;
    const pageDescription = page.description;
    let elements = page.elements;

    elements = elements.map((question) => {
      return new Question({
        title: question.title,
        description: question.description,
        typeName: question.type,
        isRequired: question.isRequired,
        multipleSelectOption: question.multipleSelectOption,
        elements: question.elements,
        labels: question.labels,
        minRateDescription: question.minRateDescription,
        maxRateDescription: question.maxRateDescription,
      });
    });

    const pageObjs = [];

    Question.insertMany(elements)
      .then((result) => {
        pageObjs.push({
          title: pageTitle,
          description: pageDescription,
          elements: result,
        });
        if (pagesIdx === pages.length - 1) {
          return Survey.create({
            creatorKey: creatorKey,
            hasExpiry: hasExpiry,
            isPublic: isPublic,
            closeAt: new Date(closeAt),
            pages: pageObjs,
          });
        }
      })
      .then((survey) => {
        return insertCreatorInfo(survey, creatorKey);
      })
      .then(() => {
        return res.status(201).json({ MESSAGE: "SUCCESS" });
      })
      .catch((error) => {
        console.log(error);
        return res.status(400).json({ ERROR: error });
      });
  });
};
