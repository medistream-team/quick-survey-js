<template>
  <div class="pollInfo" :id="pollId">
    <span class="totalAnswered">총 응답 수: {{ totalCount }}</span>
    <span v-if="hasExpiry" class="closingDate"
      >설문 기한: {{ getDate[0] }}년 {{ getDate[1] }}월 {{ getDate[2] }}일
      {{ getTime[0] }}시 {{ getTime[1] }}분 까지
    </span>
  </div>
</template>
<script>
export default {
  name: "PollInfo",
  props: {
    pollId: {
      type: String,
      required: true,
    },
    totalCount: {
      type: Number,
      required: true,
    },
    expiryDate: {
      type: String,
      required: true,
    },
    hasExpiry: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    getDate() {
      return this.expiryDate.split("T")[0].split("-");
    },
    getTime() {
      return this.expiryDate.split("T")[1].split(":").slice(0, 2);
    },
  },
};
</script>
<style lang="scss" scoped>
.pollInfo {
  margin-bottom: 10px;
  span {
    margin-right: 10px;
    font-size: 12px;
    text-align: left;
  }
}
</style>