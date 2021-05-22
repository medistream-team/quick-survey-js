<template>
  <div class="pollInfo" id="{{pollId}}">
    <span class="totalAnswered">총 응답 수: {{ totalCount }}</span>
    <span v-if="hasExpiry" class="closingDate"
      >설문 기한: {{ date[0] }}년 {{ date[1] }}월 {{ date[2] }}일
      {{ time[0] }}시 {{ time[1] }}분 까지
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
  data() {
    return {
      date: null,
      time: null,
    };
  },

  methods: {
    getDate() {
      const splittedDate = this.expiryDate.split("T");
      this.date = splittedDate[0].split("-");
      this.time = splittedDate[1].split(":").slice(0, 2);
    },
  },
  created() {
    if (this.expiryDate) {
      this.getDate();
    }
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