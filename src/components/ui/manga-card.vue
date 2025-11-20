<template>
  <router-link :to="`/manga/${manga?.id}`" class="flex flex-col w-40 group cursor-pointer">
    <div class="w-40 h-60 overflow-hidden rounded-[5px] relative">
      <img
        v-if="manga?.coverImage?.extraLarge"
        :src="manga.coverImage.extraLarge"
        :alt="manga.title?.romaji || 'Manga'"
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
      {{ manga?.title?.romaji || manga?.title?.english || "Untitled" }}
    </p>
  </router-link>
</template>

<script setup lang="ts">
interface Manga {
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
  manga?: Manga;
}>();
</script>

<style scoped></style>
