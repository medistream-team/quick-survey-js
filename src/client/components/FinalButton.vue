<template>
  <div class="buttonContainer">
    <v-btn
      large
      color="primary"
      @click="clickFinalButton"
      class="finalButton"
      :disabled="isAdmin ? !readyToCreate : !readyToSubmit"
    >
      {{ finalButtonText }}
    </v-btn>
  </div>
</template>
<script>
export default {
  name: "FinalButton",
  props: {
    isAdmin: {
      type: Boolean,
      required: true,
    },
    readyToCreate: {
      type: Boolean,
      required: false,
    },
    readyToSubmit: {
      type: Boolean,
      required: false,
    },
    finalButtonText: {
      type: String,
      required: true,
    },
  },
  methods: {
    clickFinalButton() {
      if (this.readyToSubmit) {
        this.$emit("submitResponsesData");
        this.$router.push("/poll/results");
      }
      if (this.readyToCreate) {
        this.$emit("sendPollData");
        this.$router.push("/poll");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.buttonContainer {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  // button {
  //   padding: 10px;
  //   border-style: none;
  //   border-radius: 5px;
  //   background-color: black;
  //   color: white;
  //   font-size: 18px;
  // }
}
</style>

