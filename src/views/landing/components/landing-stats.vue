<template>
  <div
    class="flex justify-center items-center gap-8 md:gap-16 lg:gap-24 w-full max-w-5xl px-8 flex-wrap"
  >
    <div
      v-for="(stat, index) in stats"
      :key="index"
      class="stat-item flex flex-col items-center gap-2"
    >
      <div class="text-4xl md:text-5xl font-light text-gray-900 tracking-tighter leading-none">
        {{ stat.value }}
      </div>
      <div class="text-xs md:text-sm font-light text-gray-500 tracking-wider uppercase">
        {{ stat.label }}
      </div>
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
