<template>
  <v-app>
    <form @submit.prevent class="survey-container">
      <div class="closed-survey" v-if="isClosed">
        <h3>종료된 투표입니다.</h3>
      </div>
      <div v-if="surveyData" class="survey-page">
        <SurveyInfo
          :surveyId="surveyData._id"
          :totalCount="surveyData.responseCount"
          :expiryDate="surveyData.closeAt"
          :hasExpiry="surveyData.hasExpiry"
        />
        <SurveyQuestion
          v-for="page in pages"
          :key="page._id"
          :page="page"
          :totalCount="surveyData.responseCount"
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
              class="close-button"
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
              <v-btn color="primary" text @click="closeSurvey"> 확인 </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </form>
  </v-app>
</template>

<script>
// TODO: event 문서에 명시하기
// TODO: headers도 userKey prop을 이용해 만들기
// TODO: getResonseData vue스럽게 바꾸기
// TODO: survey id, userkey 삭제
import {
  ADMIN_SURVEY_API,
  USER_SURVEY_API,
  SURVEY_ID,
  USER_KEY,
} from "../config";
import SurveyInfo from "./UserView/SurveyInfo";
import SurveyQuestion from "./UserView/SurveyQuestion";
import FinalButton from "./FinalButton";
import vuetify from "../plugins/vuetify";

const axios = require("axios");
const headers = {
  Authorization: USER_KEY,
};

export default {
  name: "Survey",
  vuetify,
  components: {
    SurveyInfo,
    SurveyQuestion,
    FinalButton,
  },
  props: {
    // TODO: default 삭제, required
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
      isAdmin: false,
      dialog: false,
      surveyData: null,
      pages: null,
      showResult: false,
      isSubmitted: false,
      ResponsesData: {
        answers: [],
      },
      readyToSubmit: false,
    };
  },
  computed: {},
  created() {
    axios
      .get(`${USER_SURVEY_API}/${this.$route.params.id}`, {
        headers: headers,
      })
      .then((res) => {
        if (res.data.survey.isActive) {
          this.surveyData = res.data.survey;
          this.pages = res.data.survey.pages;
        } else {
          this.isClosed = true;
        }

        let today = new Date();

        if (
          this.surveyData.closeAt &&
          new Date(this.surveyData.closeAt) < today
        ) {
          this.surveyData.isPublic
            ? this.$router.push(`/survey/results/${this.surveyId}`)
            : (this.isClosed = true);
        }

        if (this.surveyData.creatorKey === this.userKey) {
          this.isAdmin = true;
        }

        if (this.surveyData.voted) {
          alert("이미 참여한 투표입니다.");
          this.$router.push(`/survey/results/${this.surveyId}`);
        }
      })
      .catch((err) => console.log(err));
  },
  methods: {
    getResponsesData(allAnswered, surveyAnswers) {
      let ready = allAnswered ? true : false;
      this.readyToSubmit = ready;
      this.ResponsesData.answers = surveyAnswers;
    },
    submitResponsesData() {
      axios
        .post(
          `${USER_SURVEY_API}/${this.$route.params.id}`,
          this.ResponsesData,
          {
            headers: headers,
          }
        )
        .then((res) => {
          if (res.response.data.message === "success") {
            this.$emit("vote-success", this.surveyId);
          }
        })
        .catch((err) => {
          if (err.response.data.message === "already voted") {
            this.$emit("already-voted", this.surveyId);
          }
        });
    },
    closeSurvey() {
      this.dialog = false;
      //POST close survey - test needed
      const body = {
        isActive: false,
      };

      axios
        .post(`${ADMIN_SURVEY_API}/${this.surveyId}`, body, {
          headers: headers,
        })
        .then(() => {
          this.$emit("survey-closed", this.surveyId);
        })
        .catch((err) => {
          // TODO: 실패 이벤트도 적용하기
          // this.$emit("failed-to-close-survey", this.surveyId);
          console.log(err);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.survey-container {
  position: relative;
  width: 100%;
  max-width: 600px;
  margin: 50px auto;
  padding: 10px;

  .closed-survey {
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

  .close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    color: #fd6261;
  }
}
</style>
