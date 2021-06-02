import Vue from "vue";
import VueRouter from "vue-router";
import InvolvePoll from "../views/InvolvePoll.vue";
import ResultsPoll from "../views/ResultsPoll.vue";
import CreatePoll from "../views/CreatePoll.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/poll/results",
    name: "ResultsPoll",
    component: ResultsPoll,
  },
  {
    path: "/poll/results/:id",
    name: "ResultsPoll",
    component: ResultsPoll,
  },
  {
    path: "/poll/admin",
    name: "CreatePoll",
    component: CreatePoll,
  },
  {
    path: "/poll",
    name: "InvolvePoll",
    component: InvolvePoll,
  },
  {
    path: "/poll/:id",
    name: "InvolvePoll",
    component: InvolvePoll,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
