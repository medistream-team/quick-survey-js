<template>
  <div>
    <input class="pollInputBox" placeholder="투표 항목 설명" />
    <button v-if="deleteOption">delete</button>
  </div>
</template>
<script>
export default {
  name: "PollInput",
  props: {
    deleteOption: {
      type: Boolean,
      required: true,
    },
  },
};
</script>
<style lang="scss" scoped>
.pollInputBox {
  display: block;
  width: 100%;
  border: 1px solid #d8d8d8;
  height: 42px;
  margin-bottom: 10px;
  padding: 0px 10px;
  font-size: 16px;
}
</style>