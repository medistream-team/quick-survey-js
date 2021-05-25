<template>
  <div>
    <span>{{ toggleTitle }}</span>
    <input type="checkbox" />
  </div>
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