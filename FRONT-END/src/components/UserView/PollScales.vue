<template>
  <ul class="pollScales">
    <span class="min">{{ minDescription }}</span>
    <Scale
      v-for="(scale, index) in scales"
      :scaleText="scale.value"
      :scaleId="scale._id"
      :scaleCount="scale.count"
      :key="scale._id"
      :showResult="showResult"
      :totalCount="totalCount"
      :scaleStatus="scalesStatus[index]"
      :scaleIndex="index"
      :handleScalesStatus="handleScalesStatus"
    />
    <span class="max">{{ maxDescription }}</span>
  </ul>
</template>
<script>
import Scale from "./Scale";

export default {
  name: "PollScales",
  components: { Scale },
  props: {
    totalCount: {
      type: Number,
      required: true,
    },
    questionId: {
      type: String,
      required: true,
    },
    scales: {
      type: Object,
      required: true,
    },
    minDescription: {
      type: String,
      required: true,
    },
    maxDescription: {
      type: String,
      required: true,
    },
    showResult: {
      type: Boolean,
      required: true,
    },
    handleAnswersInfo: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      scalesStatus: this.scales.map(() => {
        return false;
      }),
    };
  },
  methods: {
    handleScalesStatus(index, scaleId) {
      const { handleAnswersInfo, questionId } = this;
      if (this.scalesStatus[index] === false) {
        const newArr = this.scales.map(() => {
          return false;
        });
        newArr[index] = !newArr[index];
        this.scalesStatus = newArr;
      } else {
        this.scalesStatus[index] = !this.scalesStatus[index];
      }
      handleAnswersInfo(null, questionId, scaleId, this.scalesStatus);
    },
  },
};
</script>

<style lang="scss" scoped>
.pollScales {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  padding: 0;

  span {
    margin: auto 5px;
  }
}
</style>