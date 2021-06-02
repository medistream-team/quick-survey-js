<template>
  <SurveyAdmin
    :userKey="'wednesday'"
    @survey-created="onCreated"
    @failed-to-create-survey="onFailed"
  />
</template>
<script>
import SurveyAdmin from "../components/SurveyAdmin";

export default {
  name: "CreateSurvey",
  components: {
    SurveyAdmin,
  },
  methods: {
    onCreated(surveyId) {
      this.$router.push(`/survey/${surveyId}`);
    },
    onFailed() {
      console.log("create failed");
    },
  },
};
</script>
