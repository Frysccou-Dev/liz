import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Landing",
      component: () => import("../views/landing/landing-view.vue"),
    },
    {
      path: "/home",
      name: "Home",
      component: () => import("../views/home/home-view.vue"),
    },
    {
      path: "/anime/:id",
      name: "AnimeDetail",
      component: () => import("../views/anime/anime-detail-view.vue"),
    },
  ],
});

export default router;
