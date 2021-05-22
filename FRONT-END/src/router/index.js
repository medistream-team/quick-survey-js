import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import About from "../views/About.vue";
import Poll from "../views/Poll.vue";
const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: About,
  },
  {
    path: "/poll",
    name: "Poll",
    component: Poll,
  },
  {
    path: "/results",
    name: "PollResults",
    component: () => import("../views/PollResults.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
