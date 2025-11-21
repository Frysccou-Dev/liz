<template>
  <div
    class="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-10 md:gap-12 w-full max-w-7xl px-8"
  >
    <div
      v-for="(item, index) in highlights"
      :key="index"
      class="highlight-item flex flex-col gap-4"
    >
      <div class="text-sm text-gray-400 font-light tracking-widest">
        {{ String(index + 1).padStart(2, "0") }}
      </div>
      <h3 class="text-xl md:text-2xl font-normal text-gray-900 tracking-tight m-0">
        {{ item.title }}
      </h3>
      <p class="text-base font-light text-gray-500 leading-relaxed m-0">
        {{ item.description }}
      </p>
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
