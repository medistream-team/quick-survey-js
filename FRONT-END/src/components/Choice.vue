<template>
  <div
    @click="handleChoiceBoxClick"
    :choiceStatus="choiceStatus"
    class="choiceContainer"
    :class="{ blueBorder: !showResult && isClicked }"
  >
    <div :class="{ withResult: showResult }" :style="fillResult">
      <li class="choiceBox">
        <input
          :id="choiceId"
          type="checkbox"
          :disabled="showResult ? true : false"
          :checked="isClicked ? true : null"
        />{{ choiceText }}<span v-if="showResult">({{ getResult }})</span>
      </li>
    </div>
  </div>
</template>
<script>
export default {
  name: "Choice",
  data() {
    return {
      isClicked: false,
    };
  },
  props: {
    choiceId: {
      type: String,
      required: true,
    },
    choiceText: {
      type: String,
      required: true,
    },
    choiceCount: {
      type: Number,
      required: true,
    },
    totalCount: {
      type: Number,
      required: true,
    },
    showResult: {
      type: Boolean,
      required: true,
    },
    handleChoicesCheck: {
      type: Function,
      required: true,
    },
    choiceStatus: {
      type: Boolean,
      required: true,
    },
    choiceIndex: {
      type: Number,
      required: true,
    },
  },
  methods: {
    handleChoiceBoxClick() {
      this.isClicked = !this.isClicked;
      this.handleChoicesCheck(this.choiceIndex);
    },
  },
  computed: {
    fillResult() {
      if (this.showResult) {
        return {
          width: `${(this.choiceCount / this.totalCount) * 100}%`,
        };
      }
    },
    getResult() {
      if (this.showResult) {
        return `${(this.choiceCount / this.totalCount) * 100}%`;
      }
    },
    // blueBorder() {
    //   if (!this.showResult && this.isClicked) {
    //     return {
    //       border: "1px solid rgb(205, 205, 205)",
    //     };
    //   }
    // },
  },
};
</script>
<style lang="scss" scoped>
.choiceContainer {
  position: relative;
  display: flex;
  align-items: center;
  margin: 20px 0;
  height: 42px;
  padding: 0px 10px;
  border: 1px solid rgb(205, 205, 205);
  border-radius: 5px;
  list-style: none;
  cursor: pointer;

  &.blueBorder {
    border: 1px solid #2275ff;
  }

  .choiceBox {
    white-space: nowrap;
    input {
      margin-right: 10px;
    }
    span {
      margin-left: 5px;
      font-size: 14px;
    }
  }
  .withResult {
    position: absolute;
    display: flex;
    align-items: center;
    top: 0;
    left: 0;
    padding: 0px 10px;
    background-color: #ddd;
    height: 100%;
  }
}
</style>