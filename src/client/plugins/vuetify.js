import Vue from "vue";
<<<<<<< HEAD
import Vuetify from "vuetify/lib";
import "vuetify/dist/vuetify.min.css";
=======
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
  VIcon,
} from "vuetify/lib";
>>>>>>> 149bc79... Modify: 투표 객관식 옵션 로직 수정 중
import "@mdi/font/css/materialdesignicons.css";

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
    VIcon,
  },
});

const opts = {
  icons: {
    iconfont: "mdiSvg", // 'mdi' || 'mdiSvg' || 'md' || 'fa' || 'fa4' || 'faSvg'
  },
};

export default new Vuetify(opts);
