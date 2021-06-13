<template>
  <div class="survey-page">
    <div class="survey-admin-info">
      <h2>투표</h2>
      <SurveyInput
        :handleSurveyInput="handleSurveyInput"
        :placeholder="`투표 제목`"
        :name="`title`"
      />
      <SurveyInput
        :handleSurveyInput="handleSurveyInput"
        :placeholder="`투표 추가 설명 예)복수 선택 가능`"
        :name="`description`"
      />
    </div>
    <div class="survey-types">
      <h2>투표 유형</h2>
      <div class="type-checkbox" :style="{ display: 'flex' }">
        <v-checkbox
          v-model="surveyType"
          class="typeBox checkbox"
          @click="handleSurveyType(true, 'checkbox')"
          :label="`객관식`"
        ></v-checkbox>
        <v-checkbox
          :value="!surveyType"
          class="typeBox"
          @click="handleSurveyType(false, 'rating')"
          :label="`스케일`"
        ></v-checkbox>
      </div>
    </div>
    <div v-if="surveyType" class="choice-survey">
      <h2>객관식 항목</h2>
      <div class="multiple-option">
        <v-switch
          label="중복 선택 가능"
          v-model="surveyQuestion.multipleSelectOption.allowed"
          dense
          inset
          class="toggle-box"
        ></v-switch>
      </div>
      <SurveyInput
        :handleSurveyInput="handleSurveyInput"
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
    <div v-if="!surveyType" class="scale-survey">
      <h2>스케일 항목</h2>
      <div class="min-scale">
        <input name="value" class="min-num" value="1" disabled />
        <SurveyInput
          :handleSurveyInput="handleSurveyInput"
          :placeholder="`최하 스케일 설명 예)매우 싫다`"
          :name="`minRateDescription`"
        />
      </div>
      <div class="max-scale">
        <input v-model="maxScale" class="max-num" @change="handleScaleNum" />
        <SurveyInput
          :handleSurveyInput="handleSurveyInput"
          :placeholder="`최상 스케일 설명 예)매우 좋다`"
          :name="`maxRateDescription`"
        />
      </div>
    </div>
  </div>
</template>
<script>
import SurveyInput from "./SurveyInput";
import AddButton from "./AddButton";

export default {
  name: "SurveyElement",
  components: {
    SurveyInput,
    AddButton,
  },
  props: {
    surveyQuestion: {
      type: Object,
      required: true,
    },
    selectMultiple: {
      type: Boolean,
    },
  },
  data() {
    return {
      surveyType: true,
      choiceBoxes: [0, 1],
      choicesArray: [
        {
          text: "",
          value: null,
        },
        {
          text: "",
          value: null,
        },
      ],
      surveyInputValue: "",
      minScale: 1,
      maxScale: null,
    };
  },

  methods: {
    handleSurveyType(boolean, name) {
      this.surveyType = boolean;
      this.surveyQuestion.type = name;
      this.surveyQuestion.choices = [];
    },

    handleSurveyInput(e) {
      const { value, name, id } = e.target;
      const { surveyQuestion } = this;

      if (this.surveyType && name !== "text") {
        surveyQuestion[name] = value;
        this.surveyInputValue = value;
      }

      if (this.surveyType && name === "text") {
        this.choicesArray[id] = { [name]: value, value: null };
        const filledChoicesArray = this.choicesArray.filter((choice) => {
          return choice[name] !== "" && choice !== undefined;
        });
        surveyQuestion.choices = filledChoicesArray;
      }

      if (!this.surveyType && name !== "text") {
        surveyQuestion[name] = value;
      }
    },
    deleteChoiceBox(id) {
      //순서대로 delete 하지 않을떄?
      const deleteBox = this.choiceBoxes.filter((el) => {
        return el !== id;
      });
      this.choiceBoxes = deleteBox;
      delete this.choicesArray[id];
      const filteredChoicesArray = this.choicesArray.filter((choice) => {
        return choice !== undefined;
      });

      this.surveyQuestion.choices = filteredChoicesArray;
      this.choicesArray = filteredChoicesArray;
    },
    addChoiceBox() {
      this.choiceBoxes = [...this.choiceBoxes, this.choiceBoxes.length];
      this.choicesArray = [...this.choicesArray, { text: "", value: null }];
    },
    handleScaleNum(e) {
      if (e.target.value > 10) {
        e.target.value = 10;
        this.maxScale = 10;
      }
      this.surveyQuestion.rateMax = Number(this.maxScale);
      this.surveyQuestion.rateMin = this.minScale;

      let scaleArr = Array.from(
        { length: this.maxScale - this.minScale + 1 },
        (_, i) => i + 1
      );

      this.surveyQuestion.choices = scaleArr.map((scale) => {
        return {
          value: scale,
          text: "",
        };
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.survey-page {
  h2 {
    font-weight: normal;
    margin-bottom: 20px;
    padding-bottom: 5px;
    border-bottom: 1px solid #d8d8d8;
  }
  .survey-admin-info,
  .survey-types,
  .choice-survey {
    margin-bottom: 25px;
  }

  .survey-types {
    .type-checkbox {
      display: flex;
    }
    .typeBox {
      margin-top: 0;
    }
    .checkbox {
      margin-right: 20px;
    }
  }

  .scale-survey {
    .min-scale,
    .max-scale {
      display: flex;
    }

    .min-num,
    .max-num {
      width: 40px;
      height: 42px;
      margin-right: 10px;
      text-align: center;
      border: 1px solid #d8d8d8;
    }
  }
}
</style>
