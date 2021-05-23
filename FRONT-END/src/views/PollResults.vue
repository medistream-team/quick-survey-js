<template>
  <div v-if="pollData" class="pollResultsContainer">
    <PollInfo
      :pollId="pollData.id"
      :totalCount="pollData.responsesCount"
      :expiryDate="pollData.closeAt"
      :hasExpiry="pollData.hasExpiry"
    />
    <PollQuestion
      v-for="page in pages"
      :key="page._id"
      :page="page"
      :showResult="showResult"
      :totalCount="pollData.responsesCount"
    />
  </div>
</template>

<script>
import PollInfo from "../components/PollInfo";
import PollQuestion from "../components/PollQuestion";
const axios = require("axios");

export default {
  name: "Poll",
  components: { PollInfo, PollQuestion },
  data() {
    return {
      pollData: null,
      pages: null,
      showResult: true,
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
        console.log(res);
        this.pollData = res.data.survey;
        this.pages = res.data.survey.pages;
        console.log(this.pages);
      })
      .catch((err) => console.log(err));
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.pollResultsContainer {
  max-width: 600px;
  margin: 50px auto;
  padding: 10px;
}
</style>