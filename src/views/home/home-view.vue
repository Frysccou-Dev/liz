<template>
  <div class="w-full">
    <main class="w-full">
      <div class="sections-container">
        <PopularList />
        <TrendingList />
        <RecommendedList />
        <UpcomingList />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import PopularList from "./components/popular-list.vue";
import TrendingList from "./components/trending-list.vue";
import RecommendedList from "./components/recommended-list.vue";
import UpcomingList from "./components/upcoming-list.vue";
</script>

<style scoped>
.sections-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
}
</style>
