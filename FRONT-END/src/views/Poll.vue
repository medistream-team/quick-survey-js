<template>
  <form @submit.prevent class="pollContainer">
    <div v-if="pollData" class="pollPage">
      <PollInfo
        :pollId="pollData._id"
        :totalCount="pollData.count"
        :expiryDate="pollData.closeAt"
        :hasExpiry="pollData.hasExpiry"
      />
      <PollQuestion
        v-for="page in pages"
        :key="page._id"
        :page="page"
        :totalCount="pollData.count"
        :showResult="showResult"
        :getResponsesData="getResponsesData"
      />
    </div>
    <FinalButton
      :readyToSubmit="readyToSubmit"
      @submitResponsesData="submitResponsesData"
    />
  </form>
</template>

<script>
import { USER_POLL_API } from "../config";
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
      isSubmitted: false,
      ResponsesData: {
        responses: [],
      },
      readyToSubmit: false,
    };
  },
  computed: {},
  created() {
    axios
      // .get("/pollData2.json")
      .get(`${USER_POLL_API}/60ab6887cf0eff24444a36c4`)
      .then((res) => {
        this.pollData = res.data.survey;
        this.pages = res.data.survey.pages;
      })
      .catch((err) => console.log(err));
  },
  methods: {
    getResponsesData(allAnswered, pollAnswers) {
      this.readyToSubmit = allAnswered;
      this.ResponsesData.responses = pollAnswers;
      console.log(this.readyToSubmit);
      console.log(this.ResponsesData);
    },
    submitResponsesData() {
      axios
        .post(`${USER_POLL_API}/60ab6887cf0eff24444a36c4`, this.ResponsesData)
        .then((res) => console.log(res))
        .catch((err) => console.dir(err.response.data));
    },
  },
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