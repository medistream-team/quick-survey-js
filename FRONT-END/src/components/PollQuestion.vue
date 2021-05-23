<template>
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
    />
    <PollScales
      v-if="question.type === 'rating'"
      :scales="question.type === 'rating' ? question.choices : null"
      :showResult="showResult"
      :minDescription="question.minRateDescription"
      :maxDescription="question.maxRateDescription"
      :totalCount="totalCount"
    />
  </div>
</template>
<script>
import PollTitles from "./PollTitles";
import PollChoices from "./PollChoices";
import PollScales from "./PollScales";

export default {
  name: "PollQuestion",
  components: { PollTitles, PollChoices, PollScales },
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
};
</script>
<style lang="scss" scoped>
.pollQuestion {
  margin-bottom: 40px;
}
</style>