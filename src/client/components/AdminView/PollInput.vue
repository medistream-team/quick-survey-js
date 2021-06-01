<template>
  <div class="poll-input-container">
    <input
      @change="handlePollInput"
      :placeholder="placeholder"
      class="poll-input-box"
      :name="name"
    />
    <button
      @click="$emit('deleteChoiceBox', boxId)"
      depressed
      text
      class="delete-button"
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
.poll-input-container {
  position: relative;
  width: 100%;
  .poll-input-box {
    display: block;
    width: 100%;
    border: 1px solid #d8d8d8;
    height: 42px;
    margin-bottom: 10px;
    padding: 0px 10px;
    font-size: 14px;
  }
  .delete-button {
    position: absolute;
    top: 20%;
    right: 10px;
    background-color: transparent;
  }
}
</style>
