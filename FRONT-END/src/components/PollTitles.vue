<template>
  <div class="pollTitleContainer">
    <div class="pollTitle">{{ title }}</div>
    <div class="pollSubtitle">{{ subtitle }}</div>
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
      type: String,
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