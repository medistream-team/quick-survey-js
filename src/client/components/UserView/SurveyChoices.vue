<template>
  <ul class="survey-choices">
    <Choice
      v-for="(choice, index) in choices"
      :key="choice._id"
      :choiceId="choice._id"
      :choiceText="choice.text"
      :choiceCount="choice.responseCount"
      :totalCount="totalCount"
      :showResult="showResult"
      :choiceStatus="choicesStatus[index]"
      :handleChoicesStatus="handleChoicesStatus"
      :choiceIndex="index"
      :maxChoice="maxChoice"
    />
  </ul>
</template>
<script>
import Choice from "./Choice";

export default {
  name: "SurveyChoices",
  components: { Choice },
  props: {
    choices: {
      type: Array,
      required: true,
    },
    questionId: {
      type: String,
      required: true,
    },
    showResult: {
      type: Boolean,
      required: true,
    },
    selectMultiple: {
      type: Boolean,
      required: true,
    },
    handleAnswersInfo: {
      type: Function,
      required: true,
    },
  },
  computed: {
    totalCount() {
      let count = 0;
      for (let i = 0; i < this.choices.length; i++) {
        count += this.choices[i].responseCount;
      }
      return count;
    },
    maxChoice() {
      let choiceArr = this.choices.map((choice) => {
        return Number(choice.responseCount);
      });
      return Math.max(...choiceArr);
    },
  },
  data() {
    return {
      choicesStatus: this.choices.map(() => {
        return false;
      }),
      clicked: false,
    };
  },
  methods: {
    handleChoicesStatus(index, choiceIds) {
      if (!this.showResult) {
        const { selectMultiple, choices, handleAnswersInfo, questionId } = this;
        const newArr = choices.map(() => {
          return false;
        });

        if (selectMultiple === false) {
          if (this.choicesStatus[index] === false) {
            newArr[index] = !newArr[index];
            this.choicesStatus = newArr;
          } else {
            newArr[index] = !newArr[index];
            this.choicesStatus = newArr;
          }
          handleAnswersInfo(
            selectMultiple,
            questionId,
            choiceIds,
            this.choicesStatus
          );
        } else {
          this.choicesStatus[index] = !this.choicesStatus[index];
          this.choicesStatus = this.choicesStatus.map((status) => {
            return status;
          });
          handleAnswersInfo(
            selectMultiple,
            questionId,
            choiceIds,
            this.choicesStatus
          );
        }
      }
      console.log(this.choicesStatus);
    },
  },
};
</script>
