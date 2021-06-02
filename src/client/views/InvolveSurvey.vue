<template>
  <Survey
    :surveyId="'60b5d70dfb89aa54854713f6'"
    :userKey="'thu'"
    @vote-success="voteSucceed"
    @already-voted="alreadyVoted"
    @survey-closed="surveyClosed"
  />
</template>

<script>
import Survey from "../components/Survey";

export default {
  name: "InvolveSurvey",
  components: { Survey },
  methods: {
    voteSucceed(surveyId) {
      this.$router.push(`/survey/results/${surveyId}`);
    },
    alreadyVoted(surveyId) {
      alert("이미 참여한 투표입니다.");
      this.$router.push(`/survey/results/${surveyId}`);
    },
    surveyClosed(surveyId) {
      console.log("survey-closed", surveyId);
    },
  },
};
</script>
