import axios from "axios";
import VueAxios from "vue-axios";
import Vuetify from "vuetify";
import PollAdmin from "./views/PollAdmin.vue";
require("./vuetify-reset.css");

const Plugin = {
  // eslint-disable-next-line no-unused-vars
  install(Vue, options = {}) {
    Vue.config.productionTip = false;
    Vue.use(VueAxios, axios);
    Vue.use(Vuetify);
    Vue.component("medi-poll-admin", PollAdmin);
  },
};

export default Plugin;
