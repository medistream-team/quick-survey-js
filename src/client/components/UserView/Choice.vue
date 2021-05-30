<template>
  <div
    id="choiceId"
    @click="handleChoicesStatus(choiceIndex, choiceId)"
    class="choiceContainer"
    :class="{ blueBorder: !showResult && choiceStatus }"
  >
    <div
      :class="{ withResult: showResult }"
      :style="showResult ? fillResult : null"
    >
      <li class="choiceBox">
        <v-checkbox
          :id="choiceId"
          type="checkbox"
          v-model="choiceStatus"
          :disabled="showResult"
          :label="choiceText"
          ><span v-if="showResult">({{ getResult }})</span></v-checkbox
        >
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
  },

  computed: {
    fillResult() {
      if (this.totalCount === 0) {
        return { width: "0%" };
      }

      return {
        width: `${(this.choiceCount / this.totalCount) * 100}%`,
      };
    },
    getResult() {
      if (this.totalCount === 0) {
        return "0%";
      }
      return `${(this.choiceCount / this.totalCount) * 100}%`;
    },
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
    border: 1px solid #3281d5;
  }

  .choiceBox {
    white-space: nowrap;
    input {
      margin-right: 10px;
      background-color: #3281d5;
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