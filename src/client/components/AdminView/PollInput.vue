<template>
  <div class="pollInputContainer">
    <input
      @change="handlePollInput"
      :placeholder="placeholder"
      class="pollInputBox"
      :name="name"
    />
    <button
      @click="$emit('deleteChoiceBox', boxId)"
      depressed
      text
      class="deleteButton"
      v-if="deleteOption"
    >
      <v-icon>mdi-trash-can-outline</v-icon>
    </button>
  </div>
</template>
<script>
export default {
  name: "PollInput",
  props: {
    deleteOption: {
      type: Boolean,
      required: false,
    },
    placeholder: {
      type: String,
      required: true,
    },
    deleteChoiceBox: {
      type: Function,
      required: false,
    },
    handlePollInput: {
      type: Function,
    },
    name: {
      type: String,
    },
    boxId: {
      type: Number,
    },
  },
  methods: {
    // handleInput(e) {
    //   console.log(e.target.value);
    // },
  },
};
</script>
<style lang="scss" scoped>
.pollInputContainer {
  position: relative;
  width: 100%;
  .pollInputBox {
    display: block;
    width: 100%;
    border: 1px solid #d8d8d8;
    height: 42px;
    margin-bottom: 10px;
    padding: 0px 10px;
    font-size: 14px;
  }
  .deleteButton {
    position: absolute;
    top: 20%;
    right: 10px;
    background-color: transparent;
  }
}
</style>
