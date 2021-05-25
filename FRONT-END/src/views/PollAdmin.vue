<template>
  <form @submit.prevent class="pollAdminContainer">
    <div class="pollAdmin">
      <h2>투표</h2>
      <div class="pollAdminInfo">
        <PollInput placeholder="투표 제목" />
        <PollInput placeholder="부연 설명 예)복수 선택 가능" />
      </div>
      <div class="pollTypes">
        <h2>투표 유형</h2>
        <span class="choiceType"><input type="checkbox" />객관식</span>
        <span class="scaleType"><input type="checkbox" />스케일</span>
      </div>
      <div class="choicePoll">
        <h2>객관식 항목</h2>
        <PollInput
          :deleteOption="true"
          v-for="(box, index) in choiceBoxes"
          :key="index"
        />
      </div>
      <div class="scalePoll">
        <h2>스케일 항목</h2>
        <ScaleBox /> to
        <ScaleBox />
        <input class="minDescription" placeholder="예)매우 싫다" />
        <input class="minDescription" placeholder="예)매우 좋다" />
      </div>
      <div class="expiryDate">
        <ToggleOption toggleTitle="투표 기한 적용" />
        <input type="date" />
      </div>
      <div class="openResults">
        <ToggleOption toggleTitle="결과 공개" />
      </div>
      <FinalButton finalButtonText="투표생성" />
    </div>
  </form>
</template>
<script>
import PollInput from "../components/AdminView/PollInput";
import ScaleBox from "../components/AdminView/ScaleBox";
import ToggleOption from "../components/AdminView/ToggleOption";
import FinalButton from "../components/FinalButton";
// const axios = require("axios");

export default {
  name: "PollAdmin",
  components: {
    PollInput,
    ScaleBox,
    ToggleOption,
    FinalButton,
  },
  data() {
    return {
      choiceBoxes: 2,
      toggleTitle: "",
    };
  },
};
</script>
<style lang="scss" scoped>
.pollAdminContainer {
  max-width: 600px;
  margin: 50px auto;
  padding: 10px;
  h2 {
    padding-bottom: 5px;
    border-bottom: 1px solid #d8d8d8;
  }

  .pollTypes {
    .choiceType,
    .scaleType {
      margin-right: 20px;
      input {
        margin-right: 10px;
      }
    }
  }
}
</style>