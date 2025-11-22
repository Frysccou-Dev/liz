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
    {
      path: "/social",
      name: "Social",
      component: () => import("../views/social/social-view.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: () => import("../views/NotFound.vue"),
    },
  ],
});

import { useAuthStore } from "@/stores/auth";

let authInitialized = false;

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  if (!authInitialized) {
    try {
      await authStore.initializeAuth();
      authInitialized = true;
    } catch (error) {
      console.error("Failed to initialize auth:", error);
    }
  }

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const isAuthPage = to.path === "/login" || to.path === "/register";
  const isAuthenticated = authStore.isAuthenticated;

  if (requiresAuth && !isAuthenticated) {
    next("/login");
  } else if (isAuthPage && isAuthenticated) {
    next("/home");
  } else {
    next();
  }
});

export default router;
