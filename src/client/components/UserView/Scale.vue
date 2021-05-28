<template>
  <div
    id="scaleId"
    @click="handleScalesStatus(scaleIndex, scaleId)"
    class="scaleContainer"
    :style="fillResult(scaleSize)"
    :class="{ blueBorder: !showResult && scaleStatus }"
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
  },

  computed: {
    scaleSize() {
      return (this.scaleCount / this.totalCount) * 100;
    },
  },
  methods: {
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
  font-weight: 500;
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
  &.blueBorder {
    border: 1px solid #2275ff;
    background-color: #2275ff;
    color: white;
    font-weight: 500;
  }
}
</style>