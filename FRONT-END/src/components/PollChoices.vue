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
      :handleChoicesCheck="handleChoicesCheck"
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
    totalCount: {
      type: Number,
      required: true,
    },
    showResult: {
      type: Boolean,
      required: true,
    },
    selectMultipe: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      choicesStatus: this.choices.map((choice) => {
        return false;
      }),
    };
  },

  methods: {
    handleChoicesCheck(index) {
      if (!this.selectMultiple) {
        if (this.choicesStatus[index] === false) {
          const newArr = this.choices.map((choice) => {
            return false;
          });
          newArr[index] = !newArr[index];
          this.choicesStatus = newArr;
        } else {
          this.choicesStatus[index] = !this.choicesStatus[index];
        }
      }
    },
  },
};
</script>
