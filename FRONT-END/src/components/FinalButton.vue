<template>
  <div class="buttonContainer">
    <router-link to="/results"
      ><button @click="submitPoll" class="finalButton">
        제출하기
      </button></router-link
    >
  </div>
</template>
<script>
export default {
  name: "FinalButton",
  data() {
    return {
      isSubmitted: false,
    };
  },
  methods: {
    submitPoll() {
      this.isSubmitted = !this.isSubmitted;
      // this.$emit("submit", this.isSubmitted);
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

