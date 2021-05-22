<template>
  <ul class="pollScales">
    <span class="min">{{ minDescription }}</span>
    <Scale
      v-for="scale in scales"
      :scaleText="scale.value"
      :scaleId="scale._id"
      :scaleCount="scale.count"
      :key="scale._id"
      :showResult="showResult"
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
    totalCount: {
      type: Number,
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