<template>
  <div v-if="pollData" class="pollResultsContainer">
    <PollInfo
      :pollId="pollData.id"
      :totalCount="pollData.count"
      :expiryDate="pollData.closeAt"
      :hasExpiry="pollData.hasExpiry"
    />
    <PollQuestion
      v-for="page in pages"
      :key="page._id"
      :page="page"
      :showResult="showResult"
      :totalCount="pollData.count"
    />
  </div>
</template>

<script>
import { USER_POLL_API } from "../config";
import PollInfo from "../components/UserView/PollInfo";
import PollQuestion from "../components/UserView/PollQuestion";
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
      // .get("/pollData2.json")
      .get(`${USER_POLL_API}/60ac8be9f04b09184f1120db`)
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