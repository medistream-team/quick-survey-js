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
      }
      if (this.readyToCreate) {
        this.$emit("sendPollData");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.button-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>

