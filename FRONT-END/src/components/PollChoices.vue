<template>
  <ul class="pollChoices">
    <Choice
      v-for="(choice, index) in choices"
      :key="choice._id"
      :choiceId="choice._id"
      :choiceText="choice.text"
      :choiceCount="choice.count"
      :totalCount="totalCount"
      :showResult="showResult"
      :handleChoicesStatus="handleChoicesStatus"
      :choiceStatus="choicesStatus[index]"
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
      type: Object,
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
    };
  },
  methods: {
    handleChoicesStatus(index, choiceIds) {
      const { selectMultiple, choices, handleAnswersInfo, questionId } = this;
      if (selectMultiple === false) {
        if (this.choicesStatus[index] === false) {
          const newArr = choices.map(() => {
            return false;
          });
          newArr[index] = !newArr[index];
          this.choicesStatus = newArr;
        } else {
          this.choicesStatus[index] = !this.choicesStatus[index];
        }
        handleAnswersInfo(
          selectMultiple,
          questionId,
          choiceIds,
          this.choicesStatus
        );
      } else {
        this.choicesStatus[index] = !this.choicesStatus[index];
        handleAnswersInfo(
          selectMultiple,
          questionId,
          choiceIds,
          this.choicesStatus
        );
      }
    },
  },
};
</script>
