<template>
  <div class="highlights-container">
    <div class="highlight-item" v-for="(item, index) in highlights" :key="index">
      <div class="highlight-number">{{ String(index + 1).padStart(2, "0") }}</div>
      <h3 class="highlight-title">{{ item.title }}</h3>
      <p class="highlight-description">{{ item.description }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const highlights = [
  {
    title: "Extensive Library",
    description: "Access thousands of anime titles from classic series to the latest releases.",
  },
  {
    title: "Advanced Search",
    description:
      "Find exactly what you're looking for with powerful filtering and sorting options.",
  },
  {
    title: "Detailed Information",
    description: "Get comprehensive details about each anime including ratings, genres, and more.",
  },
];
</script>

<style scoped>
.highlights-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 3rem;
  width: 100%;
  max-width: 1200px;
  padding: 0 2rem;
}

.highlight-item {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.highlight-number {
  font-size: 0.875rem;
  color: rgb(156 163 175);
  font-weight: 300;
  letter-spacing: 0.1em;
}

.highlight-title {
  font-size: 1.5rem;
  font-weight: 400;
  color: rgb(17 24 39);
  margin: 0;
  letter-spacing: -0.025em;
}

.highlight-description {
  font-size: 1rem;
  font-weight: 300;
  color: rgb(107 114 128);
  line-height: 1.6;
  margin: 0;
}

@media (max-width: 768px) {
  .highlights-container {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }

  .highlight-title {
    font-size: 1.25rem;
  }
}
</style>
