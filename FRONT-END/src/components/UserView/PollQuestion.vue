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
        :handleAnswersInfo="handleAnswersInfo"
      />
      <PollScales
        v-if="question.type === 'rating'"
        :scales="question.type === 'rating' ? question.choices : null"
        :showResult="showResult"
        :minDescription="question.minRateDescription"
        :maxDescription="question.maxRateDescription"
        :totalCount="totalCount"
        :questionId="question._id"
        :handleAnswersInfo="handleAnswersInfo"
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
      answersStatus: this.page.elements.map((q) => {
        return {
          id: q._id,
          status: false,
          choiceIds: [],
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
    getResponsesData: {
      type: Function,
      required: true,
    },
  },
  computed: {
    allAnswered() {
      return this.answersStatus.every((question) => question.status === true); //enable submit button condition
    },
  },
  methods: {
    handleAnswersInfo(selectMultiple, questionId, optionIds, optionsStatus) {
      const { getResponsesData, answersStatus } = this;

      for (let i = 0; i < answersStatus.length; i++) {
        const AS = answersStatus[i];

        if (AS.id === questionId) {
          if (optionsStatus.every((status) => status === false)) {
            AS.status = false;
            AS.choiceIds = [];
          } else {
            AS.status = true;

            if (selectMultiple) {
              if (AS.choiceIds.includes(optionIds)) {
                const dup = AS.choiceIds.indexOf(optionIds);
                AS.choiceIds.splice(dup, 1);
              } else {
                AS.choiceIds.push(optionIds);
              }
            } else {
              AS.choiceIds = [optionIds];
            }
          }
        }
      }

      if (this.allAnswered) {
        getResponsesData(
          this.allAnswered,
          answersStatus.map((status) => {
            return {
              questionId: status.id,
              choiceIds: status.choiceIds,
            };
          })
        );
      } else {
        return;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.pollQuestion {
  margin-bottom: 40px;
}
</style>