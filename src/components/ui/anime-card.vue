<template>
  <div class="flex flex-col w-40">
    <div class="w-40 h-60 overflow-hidden" style="border-radius: 5px">
      <img
        v-if="anime?.coverImage?.extraLarge"
        :src="anime.coverImage.extraLarge"
        :alt="anime.title?.romaji || 'Anime'"
        class="w-full h-full object-cover"
      />
      <div v-else class="w-full h-full bg-gray-300"></div>
    </div>
    <p class="mt-3 text-sm font-light text-gray-900 text-center line-clamp-2">
      {{ anime?.title?.romaji || anime?.title?.english || "Sin nombre" }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Anime {
  id: number;
  title?: {
    romaji?: string;
    english?: string;
    native?: string;
  };
  coverImage?: {
    extraLarge?: string;
    large?: string;
    medium?: string;
  };
}

defineProps<{
  anime?: Anime;
}>();
</script>

<style scoped></style>
