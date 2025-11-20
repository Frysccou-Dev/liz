<template>
  <nav class="sticky top-0 z-50 bg-gray-50">
    <div class="max-w-7xl mx-auto px-12 py-2 flex items-center justify-between">
      <router-link
        to="/"
        class="text-xl font-light tracking-widest text-gray-900 hover:text-gray-700 transition-colors duration-300"
      >
        liz
      </router-link>

      <div class="flex gap-8">
        <router-link
          to="/"
          class="text-sm font-light text-gray-700 hover:text-gray-900 transition-colors duration-300 relative group"
        >
          Home
          <span
            class="absolute bottom-0 left-0 w-0 h-px bg-gray-900 group-hover:w-full transition-all duration-300"
          ></span>
        </router-link>

        <router-link
          to="/home"
          class="text-sm font-light text-gray-700 hover:text-gray-900 transition-colors duration-300 relative group"
        >
          Animes
          <span
            class="absolute bottom-0 left-0 w-0 h-px bg-gray-900 group-hover:w-full transition-all duration-300"
          ></span>
        </router-link>

        <router-link
          to="/manga"
          class="text-sm font-light text-gray-700 hover:text-gray-900 transition-colors duration-300 relative group"
        >
          Mangas
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
    </div>
  </nav>
  <img src="@/assets/footer.svg" class="w-full scale-y-[-1]" />
</template>

<script setup lang="ts">
import { useAuth } from "@/composables/useAuth";
const { user } = useAuth();
</script>

<style scoped></style>
