<template>
  <router-link :to="`/anime/${anime?.id}`" class="flex flex-col w-40 group cursor-pointer">
    <div class="w-40 h-60 overflow-hidden rounded-[5px] relative">
      <img
        v-if="anime?.coverImage?.extraLarge"
        :src="anime.coverImage.extraLarge"
        :alt="anime.title?.romaji || 'Anime'"
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
      />
      <div v-else class="w-full h-full bg-gray-300"></div>
      <div
        class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"
      ></div>
    </div>
    <p
      class="mt-3 text-sm font-light text-gray-900 text-center line-clamp-2 group-hover:text-gray-600 transition-colors"
    >
      {{ anime?.title?.romaji || anime?.title?.english || "Sin nombre" }}
    </p>
  </router-link>
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
