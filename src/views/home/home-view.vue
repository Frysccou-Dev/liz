<template>
  <Loader ref="loaderRef" />
  <div class="w-full">
    <main class="w-full">
      <div class="sections-container">
        <PopularList @loaded="onComponentLoaded" />
        <TrendingList @loaded="onComponentLoaded" />
        <RecommendedList @loaded="onComponentLoaded" />
        <UpcomingList @loaded="onComponentLoaded" />
        <PersonalRecommendations @loaded="onComponentLoaded" />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Loader from "@/components/layout/loader.vue";
import PopularList from "./components/popular-list.vue";
import TrendingList from "./components/trending-list.vue";
import RecommendedList from "./components/recommended-list.vue";
import UpcomingList from "./components/upcoming-list.vue";
import PersonalRecommendations from "./components/personal-recommendations.vue";

const loaderRef = ref<InstanceType<typeof Loader>>();
let loadedComponents = 0;
const totalComponents = 5;

const onComponentLoaded = () => {
  loadedComponents++;
  if (loadedComponents === totalComponents && loaderRef.value) {
    loaderRef.value.hideLoader();
  }
};
</script>

<style scoped>
.sections-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
}
</style>
