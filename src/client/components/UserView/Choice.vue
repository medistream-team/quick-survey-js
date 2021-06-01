<template>
  <div
    id="choiceId"
    @click="handleChoicesStatus(choiceIndex, choiceId)"
    class="choice-container"
    :class="{
      blueBorder: isSelected || isMostSelected,
    }"
  >
    <div
<<<<<<< HEAD
      :class="{ ['with-result']: showResult, ['fill-most-selected']: isMostSelected }"
=======
      :class="{ withResult: showResult }"
>>>>>>> 149bc79... Modify: 투표 객관식 옵션 로직 수정 중
      :style="showResult ? fillResult : null"
    >
      <li class="choice-box">
        <v-checkbox
          :id="choiceId"
          type="checkbox"
          v-model="choiceStatus"
          :disabled="showResult"
          :label="choiceText"
        ></v-checkbox
        ><span v-if="showResult">({{ getResult }})</span>
      </li>
    </div>
  </div>
</template>
<script>
export default {
  name: "Choice",
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
      default: 0,
    },
    totalCount: {
      type: Number,
      required: true,
    },
    showResult: {
      type: Boolean,
      required: true,
    },
    handleChoicesStatus: {
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
    maxChoice: {
      type: Number,
      required: true,
    },
  },

  computed: {
    isSelected() {
      return !this.showResult && this.choiceStatus;
    },
    isMostSelected() {
      return this.showResult && this.choiceCount === this.maxChoice;
    },
    fillResult() {
      if (this.choiceCount === 0) {
        return { width: "0%" };
      } else {
        if (this.isMostSelected) {
          return {
            width: `${((this.choiceCount / this.totalCount) * 100).toFixed(
              0
            )}%`,
            "background-color": "#e6eef8",
          };
        } else {
          return {
            width: `${((this.choiceCount / this.totalCount) * 100).toFixed(
              0
            )}%`,
          };
        }
      }
    },
    getResult() {
      if (this.choiceCount === 0) {
        return "0%";
      } else {
        return `${((this.choiceCount / this.totalCount) * 100).toFixed(0)}%`;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.choice-container {
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
  font-weight: 500;

  &.blue-border {
    border: 1px solid rgb(50, 129, 213);
    // background-color: #e6eef8;
  }

  .choice-box {
    white-space: nowrap;
    display: flex;
    align-items: center;
    span {
      margin-left: 5px;
      font-size: 12px;
    }
  }
  .with-result {
    position: absolute;
    display: flex;
    align-items: center;
    height: 100%;
    top: 0;
    left: 0;
    border-radius: 5px;
    padding: 0px 10px;
    background-color: #ddd;
  }
<<<<<<< HEAD

  .fill-most-selected {
=======
  .fillMostSelected {
>>>>>>> 149bc79... Modify: 투표 객관식 옵션 로직 수정 중
    background-color: #e6eef8;
  }
}
</style>