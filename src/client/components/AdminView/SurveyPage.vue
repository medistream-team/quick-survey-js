<template>
  <div>
    <SurveyElements :surveyQuestions="surveyPage.elements" />
  </div>
</template>
<script>
import SurveyElements from "./SurveyElements";

export default {
  name: "SurveyPage",
  components: {
    SurveyElements,
  },
  props: {
    surveyPage: {
      type: Object,
      required: true,
    },
  },
};
</script>
