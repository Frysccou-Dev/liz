<template>
  <div class="stats-container">
    <div class="stat-item" v-for="(stat, index) in stats" :key="index">
      <div class="stat-value">{{ stat.value }}</div>
      <div class="stat-label">{{ stat.label }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
const stats = [
  { value: "10K+", label: "Anime Titles" },
  { value: "50+", label: "Genres" },
  { value: "Real-time", label: "Updates" },
];
</script>

<style scoped>
.stats-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6rem;
  width: 100%;
  max-width: 1000px;
  padding: 0 2rem;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.stat-value {
  font-size: 3rem;
  font-weight: 300;
  color: rgb(17 24 39);
  letter-spacing: -0.05em;
  line-height: 1;
}

.stat-label {
  font-size: 0.875rem;
  font-weight: 300;
  color: rgb(107 114 128);
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

@media (max-width: 768px) {
  .stats-container {
    gap: 3rem;
  }

  .stat-value {
    font-size: 2.5rem;
  }

  .stat-label {
    font-size: 0.75rem;
  }
}
</style>
