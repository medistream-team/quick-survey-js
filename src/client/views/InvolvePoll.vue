<template>
  <Poll
    :surveyId="'60b5d70dfb89aa54854713f6'"
    :userKey="'thu'"
    @vote-success="voteSucceed"
    @already-voted="alreadyVoted"
    @poll-closed="pollClosed"
  />
</template>

<script>
import Poll from "../components/Poll";

export default {
  name: "InvolvePoll",
  components: { Poll },
  methods: {
    voteSucceed(surveyId) {
      this.$router.push(`/poll/results/${surveyId}`);
    },
    alreadyVoted(surveyId) {
      alert("이미 참여한 투표입니다.");
      this.$router.push(`/poll/results/${surveyId}`);
    },
    pollClosed(surveyId) {
      console.log("poll-closed", surveyId);
    },
  },
};
</script>
