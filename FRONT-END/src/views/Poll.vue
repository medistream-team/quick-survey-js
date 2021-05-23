<template>
  <form @submit.prevent class="pollContainer">
    <div v-if="pollData" class="pollPage">
      <PollInfo
        :pollId="pollData._id"
        :totalCount="pollData.responsesCount"
        :expiryDate="pollData.closeAt"
        :hasExpiry="pollData.hasExpiry"
      />
      <PollQuestion
        v-for="page in pages"
        :key="page._id"
        :page="page"
        :totalCount="pollData.responsesCount"
        :showResult="showResult"
      />
    </div>
    <FinalButton />
  </form>
</template>

<script>
import PollInfo from "../components/PollInfo";
import PollQuestion from "../components/PollQuestion";
import FinalButton from "../components/FinalButton";
const axios = require("axios");

export default {
  name: "Poll",
  components: { PollInfo, PollQuestion, FinalButton },
  data() {
    return {
      pollData: null,
      pages: null,
      showResult: false,
    };
  },
  computed: {},
  created() {
    axios
      .get("/pollData2.json")
      // .get(
      //   "https://n70xgo22r2.execute-api.ap-northeast-2.amazonaws.com/dev/survey/60a74ac0cf32641cb1b8e538"
      // )
      .then((res) => {
        this.pollData = res.data.survey;
        this.pages = res.data.survey.pages;
      })
      .catch((err) => console.log(err));
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.pollContainer,
.pollResultsContainer {
  max-width: 600px;
  margin: 50px auto;
  padding: 10px;
}
</style>