<template>
  <div class="bg-gray-50 rounded-2xl p-6 space-y-6">
    <div class="md:hidden w-full rounded-lg overflow-hidden shadow-lg mb-6">
      <img :src="anime.coverImage.extraLarge" :alt="anime.title.romaji" class="w-full" />
    </div>

    <div v-if="anime.averageScore" class="flex items-center justify-between">
      <span class="text-gray-500 font-light">Score</span>
      <span class="text-xl font-bold text-gray-900">{{ anime.averageScore }}%</span>
    </div>

    <div class="space-y-4">
      <div v-if="anime.episodes" class="flex justify-between">
        <span class="text-gray-500 font-light">Episodes</span>
        <span class="text-gray-900 font-medium">{{ anime.episodes }}</span>
      </div>

      <div v-if="anime.duration" class="flex justify-between">
        <span class="text-gray-500 font-light">Duration</span>
        <span class="text-gray-900 font-medium">{{ anime.duration }} min</span>
      </div>

      <div v-if="anime.startDate" class="flex justify-between">
        <span class="text-gray-500 font-light">Release</span>
        <span class="text-gray-900 font-medium">
          {{ formatDate(anime.startDate) }}
        </span>
      </div>

      <div v-if="anime.studios?.nodes.length" class="flex flex-col gap-1">
        <span class="text-gray-500 font-light">Studio</span>
        <div class="flex flex-wrap gap-2 justify-end">
          <span
            v-for="studio in anime.studios.nodes"
            :key="studio.name"
            class="text-gray-900 font-medium text-right"
          >
            {{ studio.name }}
          </span>
        </div>
      </div>
    </div>

    <div v-if="anime.genres?.length">
      <h4 class="text-gray-500 font-light mb-3">Genres</h4>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="genre in anime.genres"
          :key="genre"
          class="px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs text-gray-600"
        >
          {{ genre }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Anime } from "@/services/anilist";

defineProps<{
  anime: Anime;
}>();

const formatDate = (date: { year: number; month: number; day: number }) => {
  if (!date.year) return "?";
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${date.day || ""} ${months[date.month - 1] || ""} ${date.year}`;
};
</script>
