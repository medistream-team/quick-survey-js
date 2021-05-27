<template>
  <div class="toggleOption">
    <span>{{ toggleTitle }}</span>
    <v-switch
      dense
      inset
      class="toggleBox"
      @click="handleIsExpiring"
      type="checkbox"
    ></v-switch>
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
    clickIsExpiring: {
      type: Function,
      required: false,
    },
  },
  methods: {
    handleIsExpiring() {
      this.$emit("clickIsExpiring");
    },
  },
};
</script>
<style lang="scss" scoped>
.toggleOption {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  height: 40px;
  .toggleBox {
    margin-left: 10px;
  }
}
</style>