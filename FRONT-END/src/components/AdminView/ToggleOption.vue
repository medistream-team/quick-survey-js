<template>
  <span>{{ toggleTitle }}</span>
  <input type="checkbox" />
</template>
<script>
export default {
  name: "ToggleOption",
  props: {
    toggleTitle: {
      type: String,
      required: true,
    },
  },
};
</script>
<style lnag="scss" scoped>
</style>