import SurveyAdmin from "./views/SurveyAdmin.vue";
import Survey from "./views/Survey.vue";
import SurveyResults from "./views/SurveyResults.vue";
import "vuetify/dist/vuetify.min.css";

const Plugin = {
  // eslint-disable-next-line no-unused-vars
  install(Vue, options = {}) {
    Vue.config.productionTip = false;
    Vue.component("open-survey-creator", SurveyAdmin);
    Vue.component("open-survey", Survey);
    Vue.component("open-survey-results", SurveyResults);
  },
};

export default Plugin;
