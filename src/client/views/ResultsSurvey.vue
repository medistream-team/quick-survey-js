<template>
  <SurveyResults :surveyId="surveyId" :userKey="'wednesday'" />
</template>

<script>
import SurveyResults from "../components/SurveyResults";

export default {
  name: "ResultsSurvey",
  data() {
    return {
      surveyId: this.$route.params.id,
    };
  },
  components: { SurveyResults },
};
</script>
