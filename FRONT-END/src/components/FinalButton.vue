<template>
  <div class="buttonContainer">
    <router-link to="/results"
      ><button
        @click="submitPoll"
        class="finalButton"
        :disabled="!readyToSubmit"
      >
        투표하기
      </button></router-link
    >
  </div>
</template>
<script>
export default {
  name: "FinalButton",
  props: {
    readyToSubmit: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    submitPoll() {
      this.$emit("submitResponsesData");
    },
  },
};
</script>

<style lang="scss" scoped>
.buttonContainer {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  button {
    padding: 10px;
    border-style: none;
    border-radius: 5px;
    background-color: black;
    color: white;
    font-size: 18px;
  }
}
</style>

