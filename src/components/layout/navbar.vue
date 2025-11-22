<template>
  <nav class="sticky top-0 z-50 bg-gray-50">
    <div class="max-w-7xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
      <router-link
        to="/"
        class="text-xl font-light tracking-widest text-gray-900 hover:text-gray-700 transition-colors duration-300 z-50 relative"
      >
        liz
      </router-link>

      <div class="hidden md:flex gap-8">
        <router-link
          v-for="link in links"
          :key="link.path"
          :to="link.path"
          class="text-sm font-light text-gray-700 hover:text-gray-900 transition-colors duration-300 relative group"
        >
          {{ link.label }}
          <span
            class="absolute bottom-0 left-0 w-0 h-px bg-gray-900 group-hover:w-full transition-all duration-300"
          ></span>
        </router-link>

        <router-link
          v-if="user"
          to="/profile"
          class="text-sm font-light text-gray-700 hover:text-gray-900 transition-colors duration-300 relative group"
        >
          Profile
          <span
            class="absolute bottom-0 left-0 w-0 h-px bg-gray-900 group-hover:w-full transition-all duration-300"
          ></span>
        </router-link>

        <router-link
          v-else
          to="/login"
          class="text-sm font-light text-gray-700 hover:text-gray-900 transition-colors duration-300 relative group"
        >
          Login
          <span
            class="absolute bottom-0 left-0 w-0 h-px bg-gray-900 group-hover:w-full transition-all duration-300"
          ></span>
        </router-link>
      </div>

      <button
        @click="isMobileMenuOpen = !isMobileMenuOpen"
        class="md:hidden z-50 relative text-gray-900 hover:text-gray-700 transition-colors"
      >
        <XIcon v-if="isMobileMenuOpen" class="w-6 h-6" />
        <MenuIcon v-else class="w-6 h-6" />
      </button>

      <div
        v-if="isMobileMenuOpen"
        class="fixed inset-0 bg-gray-50 z-40 flex flex-col items-center justify-center gap-8 md:hidden animate-fade-in"
      >
        <router-link
          v-for="link in links"
          :key="link.path"
          :to="link.path"
          @click="isMobileMenuOpen = false"
          class="text-2xl font-light text-gray-900 hover:text-gray-600 transition-colors"
        >
          {{ link.label }}
        </router-link>

        <router-link
          v-if="user"
          to="/profile"
          @click="isMobileMenuOpen = false"
          class="text-2xl font-light text-gray-900 hover:text-gray-600 transition-colors"
        >
          Profile
        </router-link>

        <router-link
          v-else
          to="/login"
          @click="isMobileMenuOpen = false"
          class="text-2xl font-light text-gray-900 hover:text-gray-600 transition-colors"
        >
          Login
        </router-link>
      </div>
    </div>
  </nav>
  <img src="@/assets/footer.svg" class="w-full scale-y-[-1]" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAuth } from "@/composables/useAuth";
import { Menu as MenuIcon, X as XIcon } from "lucide-vue-next";

const { user } = useAuth();
const isMobileMenuOpen = ref(false);

const links = [
  { label: "Home", path: "/" },
  { label: "Animes", path: "/home" },
  { label: "Mangas", path: "/manga" },
  { label: "Community", path: "/social" },
];
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
