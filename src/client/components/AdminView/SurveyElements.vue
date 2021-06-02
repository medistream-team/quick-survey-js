<template>
  <div>
    <SurveyElement
      v-for="(surveyQuestion, index) in surveyQuestions"
      :key="index"
      :surveyQuestion="surveyQuestion"
    />
  </div>
</template>
<script>
import SurveyElement from "./SurveyElement";

export default {
  name: "SurveyElements",
  components: {
    SurveyElement,
  },
  props: {
    surveyQuestions: {
      type: Array,
      required: true,
    },
  },
};
</script>
