<template>
  <nav class="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
    <div
      class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-3 sm:py-4 flex items-center justify-between"
    >
      <router-link
        to="/"
        class="text-lg sm:text-xl font-light tracking-widest text-gray-900 hover:text-gray-700 transition-colors duration-300"
      >
        liz
      </router-link>

      <div class="hidden md:flex gap-6 lg:gap-8 items-center">
        <router-link
          v-for="link in links"
          :key="link.path"
          :to="link.path"
          class="text-sm font-light text-gray-600 hover:text-gray-900 transition-colors duration-300 relative group"
        >
          {{ link.label }}
          <span
            class="absolute -bottom-1 left-0 w-0 h-px bg-gray-900 group-hover:w-full transition-all duration-300"
          ></span>
        </router-link>

        <div class="w-px h-4 bg-gray-200"></div>

        <router-link
          v-if="user"
          to="/profile"
          class="text-sm font-light text-gray-600 hover:text-gray-900 transition-colors duration-300 relative group"
        >
          Profile
          <span
            class="absolute -bottom-1 left-0 w-0 h-px bg-gray-900 group-hover:w-full transition-all duration-300"
          ></span>
        </router-link>

        <router-link
          v-else
          to="/login"
          class="px-4 py-2 bg-gray-900 text-white text-sm font-light rounded-lg hover:bg-gray-800 transition-colors duration-300"
        >
          Login
        </router-link>
      </div>

      <button
        v-if="!isMobileMenuOpen"
        @click="toggleMenu"
        class="md:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
      >
        <MenuIcon class="w-5 h-5 text-gray-900" />
      </button>
    </div>
  </nav>

  <Teleport to="body">
    <Transition name="mobile-menu">
      <div v-if="isMobileMenuOpen" class="fixed inset-0 z-100 md:hidden">
        <div class="absolute inset-0 bg-white"></div>

        <button
          @click="closeMenu"
          class="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors z-10"
        >
          <XIcon class="w-5 h-5 text-gray-900" />
        </button>

        <div class="relative h-full flex flex-col pt-20 pb-8 px-6">
          <div class="flex-1 flex flex-col gap-2">
            <router-link
              v-for="link in links"
              :key="link.path"
              :to="link.path"
              @click="closeMenu"
              class="py-4 px-4 text-xl font-light text-gray-900 hover:bg-gray-50 rounded-xl transition-colors flex items-center justify-between group"
            >
              <span>{{ link.label }}</span>
              <ChevronRightIcon
                class="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors"
              />
            </router-link>

            <div class="h-px bg-gray-100 my-4"></div>

            <router-link
              v-if="user"
              to="/profile"
              @click="closeMenu"
              class="py-4 px-4 text-xl font-light text-gray-900 hover:bg-gray-50 rounded-xl transition-colors flex items-center justify-between group"
            >
              <span>Profile</span>
              <ChevronRightIcon
                class="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors"
              />
            </router-link>

            <router-link
              v-else
              to="/login"
              @click="closeMenu"
              class="py-4 px-4 text-xl font-light text-gray-900 hover:bg-gray-50 rounded-xl transition-colors flex items-center justify-between group"
            >
              <span>Login</span>
              <ChevronRightIcon
                class="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors"
              />
            </router-link>
          </div>

          <div class="pt-8 border-t border-gray-100">
            <p class="text-sm text-gray-400 text-center">© 2026 liz</p>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useAuth } from "@/composables/useAuth";
import { Menu as MenuIcon, X as XIcon, ChevronRight as ChevronRightIcon } from "lucide-vue-next";

const { user } = useAuth();
const route = useRoute();
const isMobileMenuOpen = ref(false);

const links = [
  { label: "Home", path: "/" },
  { label: "Animes", path: "/home" },
  { label: "Mangas", path: "/manga" },
  { label: "Community", path: "/social" },
];

const toggleMenu = () => {
  isMobileMenuOpen.value = true;
  document.body.style.overflow = "hidden";
};

const closeMenu = () => {
  isMobileMenuOpen.value = false;
  document.body.style.overflow = "";
};

watch(
  () => route.path,
  () => {
    closeMenu();
  },
);
</script>

<style scoped>
.mobile-menu-enter-active {
  transition: opacity 0.25s ease;
}
.mobile-menu-leave-active {
  transition: opacity 0.2s ease;
}
.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
}
</style>
