<template>
  <ul class="pollChoices">
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
    />
  </ul>
</template>
<script>
import Choice from "./Choice";

export default {
  name: "PollChoices",
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
    totalCount: {
      type: Number,
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
        newArr[index] = !newArr[index];
        this.choicesStatus = newArr;
        handleAnswersInfo(
          selectMultiple,
          questionId,
          choiceIds,
          this.choicesStatus
        );
      }

      console.log(this.choicesStatus);
    },
  },
};
</script>
