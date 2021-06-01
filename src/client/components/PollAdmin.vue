<template>
  <v-app>
    <form @submit.prevent class="pollAdminContainer">
      <div class="pollAdmin">
        <div class="pollSetting">
          <h2>투표 설정</h2>
          <div class="expiryOption">
            <v-switch
              label="투표 기한 적용"
              v-model="createPoll.hasExpiry"
              dense
              inset
              class="toggleBox"
            ></v-switch>
            <input
              v-model="createPoll.closeAt"
              class="dateBox"
              v-if="createPoll.hasExpiry"
              type="date"
            />
          </div>
          <div class="resultsOption">
            <v-switch
              label="결과 공개"
              v-model="createPoll.isPublic"
              dense
              inset
              class="toggleBox"
            ></v-switch>
          </div>
        </div>
        <PollPage
          v-for="(page, index) in createPoll.pages"
          :key="index"
          :pollPage="page"
        />
        <FinalButton
          :isAdmin="true"
          :readyToCreate="readyToCreate"
          @sendPollData="sendPollData"
          :finalButtonText="`투표생성`"
        />
      </div>
    </form>
  </v-app>
</template>
<script>
import { ADMIN_POLL_API, USER_KEY } from "../config";
import PollPage from "./AdminView/PollPage";
import FinalButton from "./FinalButton";
import vuetify from "../plugins/vuetify";

const axios = require("axios");

export default {
  name: "PollAdmin",
  vuetify,
  components: {
    PollPage,
    FinalButton,
  },
  props: {
    onSubmit: {
      type: Function,
    },
  },
  data() {
    return {
      createPoll: {
        newSurveyId: "",
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
      const titlesAreValid = this.createPoll.pages.every((page) => {
        return page.elements.every((element) => {
          return element.title !== "";
        });
      });

      const choicesAreValid = this.createPoll.pages.every((page) => {
        return page.elements.every((element) => {
          return element.choices.length >= 2;
        });
      });

      return titlesAreValid && choicesAreValid;
    },
  },
  methods: {
    sendPollData() {
      const headers = {
        Authorization: USER_KEY,
      };

      axios
        .post(ADMIN_POLL_API, this.createPoll, {
          headers: headers,
        })
        .then((res) => {
          // console.log(res.data.surveyId);
          this.newSurveyId = res.data.surveyId;
          this.$router.push(`/poll/${this.newSurveyId}`);
        })
        .catch((err) => console.log(err));

      this.$emit("poll-created", this.createPoll);
    },
  },
};
</script>

<style lang="scss" scoped>
.poll-admin-container {
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

  .poll-setting {
    margin-bottom: 25px;
    .toggleBox {
      margin-top: 0;
    }
  }

  .poll-types {
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
