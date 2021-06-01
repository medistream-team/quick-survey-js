import PollAdmin from "./views/PollAdmin.vue";
import Poll from "./views/Poll.vue";

const Plugin = {
  // eslint-disable-next-line no-unused-vars
  install(Vue, options = {}) {
    Vue.config.productionTip = false;
    Vue.component("open-survey-creator", PollAdmin);
    Vue.component("open-survey", Poll);
  },
};

export default Plugin;
