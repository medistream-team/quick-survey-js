import Vue from "vue";
import VueRouter from "vue-router";
import InvolveSurvey from "../views/InvolveSurvey.vue";
import ResultsSurvey from "../views/ResultsSurvey.vue";
import CreateSurvey from "../views/CreateSurvey.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/survey/results",
    name: "ResultsSurvey",
    component: ResultsSurvey,
  },
  {
    path: "/survey/results/:id",
    name: "ResultsSurvey",
    component: ResultsSurvey,
  },
  {
    path: "/survey/admin",
    name: "CreateSurvey",
    component: CreateSurvey,
  },
  {
    path: "/survey",
    name: "InvolveSurvey",
    component: InvolveSurvey,
  },
  {
    path: "/survey/:id",
    name: "InvolveSurvey",
    component: InvolveSurvey,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
