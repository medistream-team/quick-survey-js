import PollAdmin from "./views/PollAdmin.vue";
import Poll from "./views/Poll.vue";
import PollResults from "./views/PollResults.vue";
import "vuetify/dist/vuetify.min.css";

const Plugin = {
  // eslint-disable-next-line no-unused-vars
  install(Vue, options = {}) {
    Vue.config.productionTip = false;
    Vue.component("open-survey-creator", PollAdmin);
    Vue.component("open-survey", Poll);
    Vue.component("open-survey-results", PollResults);
  },
};

export default Plugin;
