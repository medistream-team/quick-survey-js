<template>
  <v-app>
    <form @submit.prevent class="survey-admin-container">
      <div class="survey-admin">
        <div class="survey-setting">
          <h2>투표 설정</h2>
          <div class="expiry-option">
            <v-switch
              v-model="createSurvey.hasExpiry"
              class="toggleBox"
              label="투표 기한 적용"
              dense
              inset
            ></v-switch>
            <input
              v-if="createSurvey.hasExpiry"
              v-model="createSurvey.closeAt"
              class="dateBox"
              type="date"
            />
          </div>
          <div class="resultsOption">
            <v-switch
              v-model="createSurvey.isPublic"
              class="toggleBox"
              label="결과 공개"
              dense
              inset
            ></v-switch>
          </div>
        </div>
        <SurveyPage
          v-for="(page, index) in createSurvey.pages"
          :key="index"
          :surveyPage="page"
        />
        <FinalButton
          :isAdmin="true"
          :readyToCreate="readyToCreate"
          :finalButtonText="`투표생성`"
          @sendSurveyData="sendSurveyData"
        />
      </div>
    </form>
  </v-app>
</template>
<script>
// TODO: apiEndpoint, userKey를 prop으로 받을 수 있게하기
// TODO: survey-created, failed-to-create-survey 2개의 event를 문서에서 명시해주기
import { ADMIN_SURVEY_API, USER_KEY } from "../config";
import SurveyPage from "./AdminView/SurveyPage";
import FinalButton from "./FinalButton";
import vuetify from "../plugins/vuetify";

const axios = require("axios");

export default {
  name: "SurveyAdmin",
  vuetify,
  components: {
    SurveyPage,
    FinalButton,
  },
  data() {
    return {
      createSurvey: {
        hasExpiry: false,
        closeAt: "",
        isPublic: true,
        pages: [
          {
            title: "",
            description: "",
            elements: [
              {
                type: "checkbox",
                title: "",
                description: "",
                isRequired: true,
                multipleSelectOption: {
                  allowed: false,
                },
                choices: [],
              },
            ],
          },
        ],
      },
    };
  },
  computed: {
    readyToCreate() {
      const titlesAreValid = this.createSurvey.pages.every((page) => {
        return page.elements.every((element) => {
          return element.title !== "";
        });
      });

      const choicesAreValid = this.createSurvey.pages.every((page) => {
        return page.elements.every((element) => {
          return element.choices.length >= 2;
        });
      });

      return titlesAreValid && choicesAreValid;
    },
  },
  methods: {
    sendSurveyData() {
      const headers = {
        Authorization: USER_KEY,
      };

      axios
        .post(ADMIN_SURVEY_API, this.createSurvey, {
          headers: headers,
        })
        .then((res) => {
          this.$emit("survey-created", res.data.surveyId);
        })
        .catch(() => {
          this.$emit("failed-to-create-survey");
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.survey-admin-container {
  width: 100%;
  max-width: 600px;
  margin: 50px auto;
  padding: 10px;
  h2 {
    font-weight: normal;
    margin-bottom: 20px;
    padding-bottom: 5px;
    border-bottom: 1px solid #d8d8d8;
  }

  .survey-setting {
    margin-bottom: 25px;
    .toggleBox {
      margin-top: 0;
    }
  }

  .survey-types {
    .type-checkbox {
      display: flex;
    }
    .checkbox {
      margin-right: 20px;
    }
  }

  .expiry-option {
    display: flex;
    align-items: baseline;
    .date-box {
      margin-left: 20px;
      width: 150px;
    }
  }
}
</style>
