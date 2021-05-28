<template>
  <div>
    <PollElement
      v-for="(pollQuestion, index) in pollQuestions"
      :key="index"
      :pollQuestion="pollQuestion"
    />
  </div>
</template>
<script>
import PollElement from "./PollElement";

export default {
  name: "PollElements",
  components: {
    PollElement,
  },
  props: {
    pollQuestions: {
      type: Array,
      required: true,
    },
  },
};
</script>
