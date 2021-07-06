import SurveyAdmin from "./components/SurveyAdmin.vue";
import Survey from "./components/Survey.vue";
import SurveyResults from "./components/SurveyResults.vue";
import "vuetify/dist/vuetify.min.css";

const Plugin = {
  // eslint-disable-next-line no-unused-vars
  install(Vue, options = {}) {
    Vue.config.productionTip = false;
    Vue.component("quick-survey-admin", SurveyAdmin);
    Vue.component("quick-survey", Survey);
    Vue.component("quick-survey-results", SurveyResults);
  },
};

export default Plugin;
