<template>
  <Survey
    :surveyId="surveyId"
    :userKey="'wednesday'"
    @sent-vote="voteSent"
    @voted-already="votedAlready"
    @closed-survey="closedSurvey"
    @failed-to-close-survey="failedToCloseSurvey"
  />
</template>

<script>
import Survey from "../components/Survey";

export default {
  name: "InvolveSurvey",
  components: { Survey },
  data() {
    return {
      surveyId: this.$route.params.id,
    };
  },
  methods: {
    voteSent(surveyId) {
      this.$router.push(`/survey/results/${surveyId}`);
    },
    votedAlready(surveyId) {
      alert("이미 참여한 투표입니다.");
      this.$router.push(`/survey/results/${surveyId}`);
    },
    closedSurvey(surveyId) {
      console.log("survey-closed", surveyId);
      this.$router.push(`/survey/results/${surveyId}`);
    },
    failedToCloseSurvey() {
      console.log("failed to close surveu.");
    },
  },
};
</script>
