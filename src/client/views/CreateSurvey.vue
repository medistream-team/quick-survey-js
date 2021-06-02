<template>
  <SurveyAdmin
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
    onCreated() {
      this.$router.push("/survey");
    },
    onFailed() {
      console.log("create failed");
    },
  },
};
</script>
