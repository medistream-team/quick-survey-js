<template>
  <form @submit.prevent class="pollContainer">
    <div class="closedPoll" v-if="isClosed">
      <h3>종료된 투표입니다.</h3>
    </div>
    <div v-if="pollData" class="pollPage">
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
        :totalCount="pollData.responseCount"
        :showResult="showResult"
        :getResponsesData="getResponsesData"
      />
    </div>
    <FinalButton
      :isAdmin="false"
      finalButtonText="투표하기"
      :readyToSubmit="readyToSubmit"
      @submitResponsesData="submitResponsesData"
    />
    <div class="text-center">
      <v-dialog v-model="dialog" width="500">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-if="isAdmin"
            depressed
            small
            outlined
            class="closeButton"
            color="red lighten-2"
            dark
            v-bind="attrs"
            v-on="on"
          >
            투표 종료하기
          </v-btn>
        </template>

        <v-card>
          <v-card-title class="headline grey lighten-2">
            투표를 완전히 종료하시겠습니까?
          </v-card-title>
          <v-card-text> 확인을 누르면 투표가 종료됩니다. </v-card-text>
          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="closePoll"> 확인 </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </form>
</template>

<script>
import { USER_POLL_API, SURVEY_ID, USER_KEY } from "../config";
import PollInfo from "../components/UserView/PollInfo";
import PollQuestion from "../components/UserView/PollQuestion";
import FinalButton from "../components/FinalButton";
const axios = require("axios");
const headers = {
  Authorization: USER_KEY,
};

export default {
  name: "Poll",
  components: { PollInfo, PollQuestion, FinalButton },
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
      isClosed: false,
      isAdmin: true,
      dialog: false,
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
      .get(`${USER_POLL_API}/${this.surveyId}`, {
        headers: headers,
      })
      .then((res) => {
        if (res.data.survey.isActive) {
          this.pollData = res.data.survey;
          this.pages = res.data.survey.pages;
        } else {
          this.isClosed = true;
        }

        let today = new Date();

        if (this.pollData.closeAt && new Date(this.pollData.closeAt) < today) {
          this.pollData.isPublic
            ? this.$router.push(`/poll/results/${this.surveyId}`)
            : (this.isClosed = true);
        }

        if (this.pollData.isAdmin) {
          this.isAdmin = true; //닫기 버튼 생성
        }

        if (this.pollData.voted) {
          alert("이미 참여한 투표입니다.");
          this.$router.push(`/poll/results/${this.surveyId}`);
        }
      })
      .catch((err) => console.log(err));
  },
  methods: {
    getResponsesData(allAnswered, pollAnswers) {
      let ready = allAnswered ? true : false;
      this.readyToSubmit = ready;
      this.ResponsesData.responses = pollAnswers;
    },
    submitResponsesData() {
      axios
        .post(`${USER_POLL_API}/${this.surveyId}`, this.ResponsesData, {
          headers: headers,
        })
        .then((res) =>
          res.response.data.message === "success"
            ? this.$router.push(`/poll/results/${this.surveyId}`)
            : console.log(res)
        )
        .catch((err) => {
          if (err.response.data.message === "already voted") {
            alert("이미 참여한 투표입니다.");
            this.$router.push(`/poll/results/${this.surveyId}`);
          }
        });
    },
    closePoll() {
      this.dialog = false;
      //POST close poll - test needed
      const body = {
        isActive: false,
      };

      axios
        .post(`${USER_POLL_API}/${SURVEY_ID}`, body, {
          headers: headers,
        })
        .then((res) =>
          res.response.data.message === "success"
            ? this.$router.push(`/poll/results/${SURVEY_ID}`)
            : console.log(res)
        )
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.pollContainer {
  position: relative;
  max-width: 600px;
  margin: 50px auto;
  padding: 10px;

  .closedPoll {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    z-index: 100;
    background-color: rgba(255, 255, 255, 0.8);
    font-size: 24px;
  }

  .closeButton {
    position: absolute;
    top: 10px;
    right: 10px;
    color: #fd6261;
  }
}
</style>