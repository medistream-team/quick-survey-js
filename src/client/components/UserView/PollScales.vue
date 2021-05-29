<template>
  <ul class="pollScales">
    <span class="min">{{ minDescription }}</span>
    <Scale
      v-for="(scale, index) in scales"
      :scaleText="scale.value"
      :scaleId="scale._id"
      :scaleCount="scale.responseCount"
      :key="scale._id"
      :showResult="showResult"
      :scaleStatus="scalesStatus[index]"
      :scaleIndex="index"
      :handleScalesStatus="handleScalesStatus"
      :totalCount="totalCount"
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
    questionId: {
      type: String,
      required: true,
    },
    scales: {
      type: Array,
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
  computed: {
    totalCount() {
      let count = 0;
      for (let i = 0; i < this.scales.length; i++) {
        count += this.scales[i].responseCount;
      }
      return count;
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