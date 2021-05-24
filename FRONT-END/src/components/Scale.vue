<template>
  <div
    @click="handleScaleClick"
    class="scaleContainer"
    :style="fillResult(scaleSize)"
    :class="{ clicked: isClicked }"
  >
    <div class="scaleResult">
      <li class="eachScale">
        {{ scaleText }}
        <span v-if="showResult">{{ getResult(scaleSize) }}</span>
      </li>
    </div>
  </div>
</template>
<script>
export default {
  name: "Scale",
  props: {
    totalCount: {
      type: Number,
      required: true,
    },
    scaleId: {
      type: String,
      required: true,
    },
    scaleText: {
      type: String,
      required: true,
    },
    scaleCount: {
      type: Number,
      required: true,
    },
    showResult: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      isClicked: false,
    };
  },
  computed: {
    scaleSize() {
      return (this.scaleCount / this.totalCount) * 100;
    },
  },
  methods: {
    handleScaleClick() {
      if (!this.showResult) {
        this.isClicked = !this.isClicked;
      }
    },
    fillResult(num) {
      if (this.showResult) {
        return {
          background: `linear-gradient(to top, #ddd ${num}%, #fff ${num}%)`,
        };
      }
    },
    getResult(num) {
      if (this.showResult) {
        return `${num}%`;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.scaleContainer {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 2px 7px;
  width: 50px;
  height: 50px;
  border: 1px solid #d8d8d8;
  border-radius: 50%;
  list-style-type: none;
  cursor: pointer;
  .eachScale {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    span {
      font-size: 12px;
    }
  }
  &.clicked {
    border: 1px solid #2275ff;
  }
}
</style>