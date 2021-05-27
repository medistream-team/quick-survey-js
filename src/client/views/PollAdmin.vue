<template>
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
</template>
<script>
import { ADMIN_POLL_API, TOKEN } from "../config";
import PollPage from "../components/AdminView/PollPage";
import FinalButton from "../components/FinalButton";

const axios = require("axios");

export default {
  name: "PollAdmin",
  components: {
    PollPage,
    FinalButton,
  },
  data() {
    return {
      readyToCreate: true,
      createPoll: {
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
  computed: {},
  methods: {
    checkReadyToCreate() {
      //condition to check before submit
    },
    sendPollData() {
      console.log(this.createPoll);
      const headers = {
        Authorization: TOKEN,
      };

      axios
        .post(ADMIN_POLL_API, this.createPoll, {
          headers: headers,
        })
        .then((res) => {
          return console.log(res);
        })
        .catch((err) => console.log(err));
    },
  },
};
</script>
<style lang="scss" scoped>
.pollAdminContainer {
  max-width: 600px;
  margin: 50px auto;
  padding: 10px;
  h2 {
    margin-bottom: 20px;
    padding-bottom: 5px;
    border-bottom: 1px solid #d8d8d8;
  }

  .pollSetting {
    margin-bottom: 25px;
  }

  .pollTypes {
    .typeCheckbox {
      display: flex;
    }
    .checkbox {
      margin-right: 20px;
    }
  }

  .expiryOption {
    display: flex;
    align-items: baseline;
    .dateBox {
      margin-left: 20px;
      width: 150px;
    }
  }
}
</style>