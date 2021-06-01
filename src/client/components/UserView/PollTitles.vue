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
.poll-title-container {
  .poll-title {
    font-size: 24px;
    overflow-wrap: break-word;
  }

  .poll-subtitle {
    font-size: 14px;
  }
}
</style>