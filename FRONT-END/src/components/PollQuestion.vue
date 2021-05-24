<template>
  <div class="pollQuestionContainer">
    <div
      class="pollQuestion"
      v-for="question in page.elements"
      :key="question._id"
    >
      <PollTitles :title="question.title" :subtitle="question.description" />
      <PollChoices
        v-if="question.type === 'checkbox'"
        :choices="question.choices"
        :totalCount="totalCount"
        :showResult="showResult"
        :selectMultiple="question.multipleSelectOption.allowed"
        :questionId="question._id"
        :checkQuestionsStatus="checkQuestionsStatus"
      />
      <PollScales
        v-if="question.type === 'rating'"
        :scales="question.type === 'rating' ? question.choices : null"
        :showResult="showResult"
        :minDescription="question.minRateDescription"
        :maxDescription="question.maxRateDescription"
        :totalCount="totalCount"
        :questionId="question._id"
        :checkQuestionsStatus="checkQuestionsStatus"
      />
    </div>
  </div>
</template>
<script>
import PollTitles from "./PollTitles";
import PollChoices from "./PollChoices";
import PollScales from "./PollScales";

export default {
  name: "PollQuestion",
  components: { PollTitles, PollChoices, PollScales },
  data() {
    return {
      questionsStatus: this.page.elements.map((q) => {
        return {
          id: q._id,
          status: false,
        };
      }),
    };
  },
  props: {
    page: {
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
  },
  computed: {
    readyToSubmit() {
      return this.questionsStatus.every((question) => question.status === true);
    },
  },
  methods: {
    checkQuestionsStatus(questionId) {
      for (let i = 0; i < this.questionsStatus.length; i++) {
        if (this.questionsStatus[i].id === questionId) {
          this.questionsStatus[i].status = true;
        }
      }
      console.log(this.questionsStatus);
      console.log(this.readyToSubmit);
    },
  },
};
</script>
<style lang="scss" scoped>
.pollQuestion {
  margin-bottom: 40px;
}
</style>