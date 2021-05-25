<template>
  <select>
    <option v-for="value in scaleValues" :key="value">{{ value }}</option>
  </select>
</template>
<script>
export default {
  name: "ScaleBox",
  data() {
    return {
      scaleValues: Array.from({ length: 10 }, (_, i) => i + 1),
    };
  },
};
</script>