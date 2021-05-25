import { createRouter, createWebHistory } from "vue-router";
import Poll from "../views/Poll.vue";
import PollResults from "../views/PollResults.vue";
import PollAdmin from "../views/PollAdmin.vue";
const routes = [
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
    path: "/poll/results",
    name: "PollResults",
    component: PollResults,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
