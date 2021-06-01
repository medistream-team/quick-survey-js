<template>
  <div class="button-container">
    <v-btn
      large
      depressed
      color="primary"
      @click="clickFinalButton"
      class="final-button"
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
}
</style>

