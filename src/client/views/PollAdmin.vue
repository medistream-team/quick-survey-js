<template>
  <form @submit.prevent class="pollAdminContainer">
    <div class="pollAdmin">
      <div class="pollAdminInfo">
        <h2>투표</h2>
        <PollInput :placeholder="`투표 제목`" />
        <PollInput :placeholder="`투표 추가 설명 예)복수 선택 가능`" />
      </div>
      <div class="pollSetting">
        <h2>투표 설정</h2>
        <div class="expiryOption">
          <ToggleOption
            @clickIsExpiring="clickIsExpiring"
            toggleTitle="투표 기한 적용"
          />
          <input class="dateBox" v-if="isExpiring" type="date" />
        </div>
        <div class="resultsOption">
          <ToggleOption toggleTitle="결과 공개" />
        </div>
      </div>
      <div class="pollTypes">
        <h2>투표 유형</h2>
        <div class="typeCheckbox">
          <v-checkbox
            class="checkbox"
            v-model="pollTypes"
            @click="clickPollType(true)"
            :label="`객관식`"
          ></v-checkbox>
          <v-checkbox
            :value="!pollTypes"
            @click="clickPollType(false)"
            :label="`스케일`"
          ></v-checkbox>
        </div>
      </div>
      <div v-if="pollTypes" class="choicePoll">
        <h2>객관식 항목</h2>
        <PollInput
          @deleteChoiceBox="deleteChoiceBox"
          :placeholder="`객관식 항목 설명`"
          :deleteOption="true"
          v-for="(box, index) in choiceBoxes"
          :key="index"
        />
        <AddButton @addChoiceBox="addChoiceBox" />
      </div>
      <div v-if="!pollTypes" class="scalePoll">
        <h2>스케일 항목</h2>
        <div class="minScale">
          <ScaleBox :scaleLength="1" />
          <PollInput :placeholder="`최하 스케일 설명 예)매우 싫다`" />
        </div>
        <div class="maxScale">
          <ScaleBox :scaleLength="9" :startAt="2" />
          <PollInput :placeholder="`최상 스케일 설명 예)매우 좋다`" />
        </div>
      </div>
      <FinalButton
        :readyToCreate="readyToCreate"
        @sendPollData="sendPollData"
        :finalButtonText="`투표생성`"
      />
    </div>
  </form>
</template>
<script>
import PollInput from "../components/AdminView/PollInput";
import ScaleBox from "../components/AdminView/ScaleBox";
import ToggleOption from "../components/AdminView/ToggleOption";
import FinalButton from "../components/FinalButton";
import AddButton from "../components/AdminView/AddButton";
// const axios = require("axios");

export default {
  name: "PollAdmin",
  components: {
    PollInput,
    ScaleBox,
    ToggleOption,
    FinalButton,
    AddButton,
  },
  data() {
    return {
      pollTypes: true,
      choiceBoxes: 2,
      toggleTitle: "",
      isExpiring: false,
      readyToCreate: true,
    };
  },
  methods: {
    clickPollType(type) {
      this.pollTypes = type;
    },
    clickIsExpiring() {
      this.isExpiring = !this.isExpiring;
    },
    deleteChoiceBox() {
      this.choiceBoxes--;
    },
    addChoiceBox() {
      this.choiceBoxes++;
    },
    sendPollData() {
      const pollData = {
        hasExpiry: this.isExpiring,
      };

      console.log(pollData);
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
  .pollAdminInfo,
  .pollSetting,
  .pollTypes,
  .choicePoll {
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

  .scalePoll {
    .minScale,
    .maxScale {
      display: flex;
    }
  }
}
</style>