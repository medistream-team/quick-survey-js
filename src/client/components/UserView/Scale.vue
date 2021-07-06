<template>
  <div
    id="scaleId"
    @click="handleScalesStatus(scaleIndex, scaleId)"
    class="scale-container"
    :style="fillResult(scaleSize)"
    :class="{
      selected: !showResult && scaleStatus,
      ['fill-most-selected']: isMostSelected,
    }"
  >
    <li class="each-scale">
      {{ scaleText }}
      <span class="scale-result" v-if="showResult">{{
        getResult(scaleSize)
      }}</span>
    </li>
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
      type: [String, Number],
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
    scaleStatus: {
      type: Boolean,
      required: true,
    },
    scaleIndex: {
      type: Number,
      required: true,
    },
    handleScalesStatus: {
      type: Function,
      required: true,
    },
    maxScale: {
      type: Number,
      required: true,
    },
  },

  computed: {
    isMostSelected() {
      return this.showResult && this.scaleCount === this.maxScale;
    },
    scaleSize() {
      if (this.totalCount === 0) {
        return 0;
      }
      return ((this.scaleCount / this.totalCount) * 100).toFixed(0);
    },
  },
  methods: {
    fillResult(num) {
      if (this.showResult && this.isMostSelected) {
        return {
          background: `linear-gradient(to top, #e6eef8 ${num}%, #fff ${num}%)`,
        };
      }
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
.scale-container {
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
  font-weight: 500;
  cursor: pointer;
  .each-scale {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .scale-result {
      font-size: 12px;
    }
  }
  &.selected {
    border: 1px solid #3281d5;
    background-color: #3281d5;
    color: white;
    font-weight: 500;
  }

  &.fill-most-selected {
    border: 1px solid #3281d5;
    background-color: #e6eef8;
  }
}
@media screen and (max-width: 500px) {
  .scale-container {
    width: 40px;
    height: 40px;
    .each-scale {
      font-size: 14px;
      .scale-result {
        font-size: 10px;
      }
    }
  }
}
</style>