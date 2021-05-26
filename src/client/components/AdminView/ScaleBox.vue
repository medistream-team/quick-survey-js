<template>
  <select class="scaleSelect">
    <option class="scaleValue" v-for="value in scaleValues" :key="value">
      {{ value }}
    </option>
  </select>
</template>
<script>
export default {
  name: "ScaleBox",
  props: {
    scaleLength: {
      type: Number,
      required: true,
    },
    startAt: {
      type: Number,
      required: false,
    },
  },
  data() {
    return {
      scaleValues: Array.from(
        { length: this.scaleLength },
        (_, i) => i + (this.startAt ? this.startAt : 1)
      ),
    };
  },
};
</script>
<style lang="scss" scoped>
.scaleSelect {
  appearance: checkbox;
  width: 45px;
  height: 42px;
  margin-right: 20px;
}
</style>