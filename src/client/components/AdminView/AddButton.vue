<template>
  <v-btn class="add-button" depressed block @click="$emit('addChoiceBox')"
    >항목 추가</v-btn
  >
</template>
<script>
export default {
  name: "AddButton",
  props: {
    addChoiceBox: {
      type: Function,
    },
  },
};
</script>
<style lang="scss" scoped>
</style>
