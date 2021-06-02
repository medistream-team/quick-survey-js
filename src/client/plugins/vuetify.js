import Vue from "vue";
import Vuetify, {
  VApp,
  VDialog,
  VCard,
  VDivider,
  VSpacer,
  VCardActions,
  VCardTitle,
  VCardText,
  VBtn,
  VSwitch,
  VCheckbox,
} from "vuetify/lib";

Vue.use(Vuetify, {
  components: {
    VApp,
    VDialog,
    VCard,
    VDivider,
    VSpacer,
    VCardActions,
    VCardTitle,
    VCardText,
    VBtn,
    VSwitch,
    VCheckbox,
  },
});

const opts = {
  icons: {
    iconfont: "mdiSvg", // 'mdi' || 'mdiSvg' || 'md' || 'fa' || 'fa4' || 'faSvg'
  },
};

export default new Vuetify(opts);
