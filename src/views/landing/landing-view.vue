<template>
  <div class="min-h-screen flex flex-col">
    <div class="h-screen relative flex flex-col items-center justify-center">
      <div class="absolute inset-x-0 top-[18vh] sm:top-[14vh] md:top-[16vh] lg:top-[18vh] z-20">
        <Searchbar v-model="searchQuery" />
      </div>
      <div class="flex-1 flex items-end justify-center">
        <LandingHero />
      </div>
    </div>

    <div class="min-h-screen flex flex-col items-center justify-center px-4 py-20">
      <LandingFeatures />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import LandingHero from "./components/landing-hero.vue";
import LandingFeatures from "./components/landing-features.vue";
import Searchbar from "@/components/layout/searchbar.vue";

const searchQuery = ref("");
</script>

<style scoped></style>
