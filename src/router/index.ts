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
      meta: { requiresAuth: true },
    },
    {
      path: "/anime/:id",
      name: "AnimeDetail",
      component: () => import("../views/anime/anime-detail-view.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/manga",
      name: "Manga",
      component: () => import("../views/manga/manga-view.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/manga/:id",
      name: "MangaDetail",
      component: () => import("../views/manga/manga-detail-view.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/login",
      name: "Login",
      component: () => import("../views/auth/login-view.vue"),
    },
    {
      path: "/register",
      name: "Register",
      component: () => import("../views/auth/register-view.vue"),
    },
    {
      path: "/profile",
      name: "Profile",
      component: () => import("../views/profile/profile-view.vue"),
      meta: { requiresAuth: true },
    },
  ],
});

import { supabase } from "@/utils/supabase";

router.beforeEach(async (to, from, next) => {
  try {
    const { data } = await supabase.auth.getSession();
    const currentUser = data.session?.user;

    if (to.matched.some((record) => record.meta.requiresAuth) && !currentUser) {
      next("/login");
    } else if ((to.path === "/login" || to.path === "/register") && currentUser) {
      next("/home");
    } else {
      next();
    }
  } catch (error) {
    console.error("Auth check failed:", error);
    // En caso de error (ej: sin conexión o config), permitir navegación a rutas públicas
    if (to.matched.some((record) => record.meta.requiresAuth)) {
      next("/login");
    } else {
      next();
    }
  }
});

export default router;
