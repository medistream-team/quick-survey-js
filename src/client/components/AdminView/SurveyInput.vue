<template>
  <div class="survey-input-container">
    <input
      class="survey-input-box"
      :id="boxId"
      :name="name"
      :placeholder="placeholder"
      @change="handleSurveyInput"
    />
    <button
      v-if="deleteOption"
      class="delete-button"
      @click="$emit('deleteChoiceBox', boxId)"
      depressed
      text
    >
      삭제
    </button>
  </div>
</template>
<script>
export default {
  name: "SurveyInput",
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
    handleSurveyInput: {
      type: Function,
    },
    name: {
      type: String,
    },
    boxId: {
      type: Number,
    },
  },
};
</script>
<style lang="scss" scoped>
.survey-input-container {
  position: relative;
  width: 100%;
  .survey-input-box {
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
    top: 25%;
    right: 10px;
    background-color: transparent;
    color: gray;
    font-size: 14px;
  }
}
</style>
