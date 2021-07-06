<template>
  <div class="survey-title-container">
    <div class="survey-title">{{ title }}</div>
    <div class="survey-subtitle">{{ subtitle }}</div>
  </div>
</template>
<script>
export default {
  name: "SurveyTitle",
  props: {
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: null,
      required: true,
    },
  },
  setup() {},
};
</script>

<style lang="scss" scoped>
.survey-title-container {
  .survey-title {
    font-size: 24px;
    overflow-wrap: break-word;
  }

  .survey-subtitle {
    font-size: 14px;
  }
}
</style>
