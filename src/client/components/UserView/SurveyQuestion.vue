<template>
  <div class="survey-question-container">
    <div
      class="survey-question"
      v-for="question in page.elements"
      :key="question._id"
    >
      <SurveyTitles :title="question.title" :subtitle="question.description" />
      <SurveyChoices
        v-if="question.type === 'checkbox'"
        :choices="question.choices"
        :showResult="showResult"
        :selectMultiple="question.multipleSelectOption.allowed"
        :questionId="question._id"
        :handleAnswersInfo="handleAnswersInfo"
      />
      <SurveyScales
        v-if="question.type === 'rating'"
        :scales="question.type === 'rating' ? question.choices : null"
        :showResult="showResult"
        :minDescription="question.minRateDescription"
        :maxDescription="question.maxRateDescription"
        :questionId="question._id"
        :handleAnswersInfo="handleAnswersInfo"
      />
    </div>
  </div>
</template>
<script>
import SurveyTitles from "./SurveyTitles";
import SurveyChoices from "./SurveyChoices";
import SurveyScales from "./SurveyScales";

export default {
  name: "SurveyQuestion",
  components: { SurveyTitles, SurveyChoices, SurveyScales },
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
    showResult: {
      type: Boolean,
      required: true,
    },
    getResponsesData: {
      type: Function,
      required: false,
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
        console.log(this.allAnswered);
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
        getResponsesData(this.allAnswered, []);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.survey-question {
  margin-bottom: 40px;
}
</style>
