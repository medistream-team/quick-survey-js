<template>
  <div>
    <PollElements :pollQuestions="pollPage.elements" />
  </div>
</template>
<script>
import PollElements from "./PollElements";

export default {
  name: "PollPage",
  components: {
    PollElements,
  },
  props: {
    pollPage: {
      type: Object,
      required: true,
    },
  },
};
</script>
