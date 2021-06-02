<template>
  <PollAdmin @poll-created="onCreated" @failed-to-create-poll="onFailed" />
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
    onFailed() {
      console.log("create failed");
    },
  },
};
</script>
