<template>
  <PollAdmin @poll-created="onCreated" />
</template>
<script>
import PollAdmin from "../components/PollAdmin";

export default {
  name: "CreatePoll",
  components: {
    PollAdmin,
  },
  methods: {
    onCreated(createPoll) {
      console.log(createPoll);
      this.$router.push("/poll");
    },
  },
};
</script>
