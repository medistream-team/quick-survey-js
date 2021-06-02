<template>
  <v-app>
    <div v-if="pollData" class="poll-results-container">
      <PollInfo
        :pollId="pollData._id"
        :totalCount="pollData.responseCount"
        :expiryDate="pollData.closeAt"
        :hasExpiry="pollData.hasExpiry"
      />
      <PollQuestion
        v-for="page in pages"
        :key="page._id"
        :page="page"
        :showResult="showResult"
      />
    </div>
  </v-app>
</template>

<script>
import { USER_POLL_API, SURVEY_ID, USER_KEY } from "../config";
import PollInfo from "../components/UserView/PollInfo";
import PollQuestion from "../components/UserView/PollQuestion";
import vuetify from "../plugins/vuetify";

const axios = require("axios");
const headers = {
  Authorization: USER_KEY,
};

export default {
  name: "Poll",
  vuetify,
  components: { PollInfo, PollQuestion },
  props: {
    surveyId: {
      type: String,
      default: SURVEY_ID,
    },
    userKey: {
      type: String,
      default: USER_KEY,
    },
  },
  data() {
    return {
      pollData: null,
      pages: null,
      showResult: true,
    };
  },
  created() {
    axios
      // .get("../public/pollData.json")
      .get(`${USER_POLL_API}/${this.$route.params.id}`, {
        headers: headers,
      })
      .then((res) => {
        this.pollData = res.data.survey;
        this.pages = res.data.survey.pages;
      })
      .catch((err) => console.log(err));
  },
};
</script>

<style lang="scss" scoped>
.poll-results-container {
  width: 100%;
  max-width: 600px;
  margin: 50px auto;
  padding: 10px;
}
</style>
