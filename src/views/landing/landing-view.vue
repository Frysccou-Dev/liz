<template>
  <div class="h-screen relative">
    <div class="absolute inset-x-0 top-[18vh] sm:top-[14vh] md:top-[16vh] lg:top-[18vh] z-20">
      <Searchbar v-model="searchQuery" />
    </div>
    <div class="flex items-end justify-center h-full">
      <LandingHero />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import LandingHero from "./components/landing-hero.vue";
import Searchbar from "@/components/layout/searchbar.vue";

const searchQuery = ref("");
</script>

<style scoped></style>
