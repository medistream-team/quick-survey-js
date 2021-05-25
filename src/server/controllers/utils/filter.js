exports.missingElements = (survey, responses, mustElements = []) => {
  survey.pages.forEach((page) => {
    page.elements.forEach((element) => {
      if (element.isRequired) {
        mustElements.push(String(element._id));
      }
    });
  });

  const respondedElements = responses.map((response) => response.questionId);
  const missingElements = mustElements.filter((element) => {
    return !respondedElements.includes(element);
  });
  return missingElements.length;
};
