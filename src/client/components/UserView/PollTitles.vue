<template>
  <div class="poll-title-container">
    <div class="poll-title">{{ title }}</div>
    <div class="poll-subtitle">{{ subtitle }}</div>
  </div>
</template>
<script>
export default {
  name: "PollTitle",
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
.pollTitleContainer {
  .pollTitle {
    font-size: 24px;
    overflow-wrap: break-word;
  }

  .pollSubtitle {
    font-size: 14px;
  }
}
</style>