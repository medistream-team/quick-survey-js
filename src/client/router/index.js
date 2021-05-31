import Vue from "vue";
import VueRouter from "vue-router";
import Poll from "../views/Poll.vue";
import PollResults from "../views/PollResults.vue";
import PollAdmin from "../views/PollAdmin.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/poll/results",
    name: "PollResults",
    component: PollResults,
  },
  {
    path: "/poll/results/:id",
    name: "PollResults",
    component: PollResults,
  },
  {
    path: "/poll/admin",
    name: "PollAdmin",
    component: PollAdmin,
  },
  {
    path: "/poll",
    name: "Poll",
    component: Poll,
  },
  {
    path: "/poll/:id",
    name: "Poll",
    component: Poll,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
