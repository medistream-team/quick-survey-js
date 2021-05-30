<template>
  <div class="pollPage">
    <div class="pollAdminInfo">
      <h2>투표</h2>
      <PollInput
        :handlePollInput="handlePollInput"
        :placeholder="`투표 제목`"
        :name="`title`"
      />
      <PollInput
        :handlePollInput="handlePollInput"
        :placeholder="`투표 추가 설명 예)복수 선택 가능`"
        :name="`description`"
      />
    </div>
    <div class="pollTypes">
      <h2>투표 유형</h2>
      <div class="typeCheckbox">
        <v-checkbox
          v-model="pollType"
          class="checkbox"
          @click="handlePollType(true, 'checkbox')"
          :label="`객관식`"
        ></v-checkbox>
        <v-checkbox
          :value="!pollType"
          @click="handlePollType(false, 'rating')"
          :label="`스케일`"
        ></v-checkbox>
      </div>
    </div>
    <div v-if="pollType" class="choicePoll">
      <h2>객관식 항목</h2>
      <div class="multipleOption">
        <v-switch
          label="중복 선택 가능"
          v-model="pollQuestion.multipleSelectOption.allowed"
          dense
          inset
          class="toggleBox"
        ></v-switch>
      </div>
      <PollInput
        :handlePollInput="handlePollInput"
        @deleteChoiceBox="deleteChoiceBox"
        :placeholder="`객관식 항목 설명`"
        :deleteOption="true"
        v-for="(box, index) in choiceBoxes"
        :key="index"
        :boxId="index"
        :name="`text`"
      />
      <AddButton @addChoiceBox="addChoiceBox" />
    </div>
    <div v-if="!pollType" class="scalePoll">
      <h2>스케일 항목</h2>
      <div class="minScale">
        <input name="value" class="minNum" value="1" disabled />
        <PollInput
          :handlePollInput="handlePollInput"
          :placeholder="`최하 스케일 설명 예)매우 싫다`"
          :name="`minRateDescription`"
          v-model="minText"
        />
      </div>
      <div class="maxScale">
        <input v-model="maxScale" class="maxNum" @change="handleScaleNum" />
        <PollInput
          :handlePollInput="handlePollInput"
          :placeholder="`최상 스케일 설명 예)매우 좋다`"
          :name="`maxRateDescription`"
          v-model="maxText"
        />
      </div>
    </div>
  </div>
</template>
<script>
import PollInput from "./PollInput";
import AddButton from "./AddButton";

export default {
  name: "PollElement",
  components: {
    PollInput,
    AddButton,
  },
  props: {
    pollQuestion: {
      type: Object,
      required: true,
    },
    selectMultiple: {
      type: Boolean,
    },
  },
  data() {
    return {
      pollType: true,
      choiceBoxes: [0, 1],
      pollInputValue: "",
      minScale: 1,
      maxScale: null,
      minText: "",
      maxText: "",
    };
  },

  methods: {
    handlePollType(boolean, name) {
      this.pollType = boolean;
      this.pollQuestion.type = name;
      this.pollQuestion.choices = [];
    },

    handlePollInput(e) {
      const { value, name } = e.target;
      const { pollQuestion } = this;
      if (this.pollType && name !== "text") {
        pollQuestion[name] = value;
        this.pollInputValue = value;
      }

      if (this.pollType && name === "text") {
        pollQuestion.choices.push({
          [name]: value,
          value: null,
        });
        console.log(pollQuestion);
      }

      if (!this.pollType && name !== "text") {
        pollQuestion[name] = value;
        console.log(pollQuestion);
      }
    },
    deleteChoiceBox(id) {
      const deleteBox = this.choiceBoxes.filter((el) => {
        return el !== id;
      });
      this.choiceBoxes = deleteBox;
      this.pollQuestion.choices.splice(id, 1);
    },
    addChoiceBox() {
      this.choiceBoxes = [...this.choiceBoxes, this.choiceBoxes.length];
    },
    handleScaleNum(e) {
      if (e.target.value > 10) {
        e.target.value = 10;
        this.maxScale = 10;
      }
      this.pollQuestion.rateMax = Number(this.maxScale);
      this.pollQuestion.rateMin = this.minScale;

      let scaleArr = Array.from(
        { length: this.maxScale - this.minScale + 1 },
        (_, i) => i + 1
      );

      this.pollQuestion.choices = scaleArr.map((scale) => {
        return {
          value: scale,
          text: "",
        };
      });
      console.log(this.pollQuestion);
    },
  },
};
</script>
<style lang="scss" scoped>
.pollPage {
  h2 {
    margin-bottom: 20px;
    padding-bottom: 5px;
    border-bottom: 1px solid #d8d8d8;
  }
  .pollAdminInfo,
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

  .scalePoll {
    .minScale,
    .maxScale {
      display: flex;
    }

    .minNum,
    .maxNum {
      width: 40px;
      height: 42px;
      margin-right: 10px;
      text-align: center;
      border: 1px solid #d8d8d8;
    }
  }
}
</style>