<template>
  <div class="bg-gray-50 rounded-2xl p-6 space-y-6">
    <div class="md:hidden w-full rounded-lg overflow-hidden shadow-lg mb-6">
      <img :src="manga.coverImage.extraLarge" :alt="manga.title.romaji" class="w-full" />
    </div>

    <div v-if="manga.averageScore" class="flex items-center justify-between">
      <span class="text-gray-500 font-light">Score</span>
      <span class="text-xl font-bold text-gray-900">{{ manga.averageScore }}%</span>
    </div>

    <div class="space-y-4">
      <div v-if="manga.chapters" class="flex justify-between">
        <span class="text-gray-500 font-light">Chapters</span>
        <span class="text-gray-900 font-medium">{{ manga.chapters }}</span>
      </div>

      <div v-if="manga.volumes" class="flex justify-between">
        <span class="text-gray-500 font-light">Volumes</span>
        <span class="text-gray-900 font-medium">{{ manga.volumes }}</span>
      </div>

      <div v-if="manga.startDate" class="flex justify-between">
        <span class="text-gray-500 font-light">Start Date</span>
        <span class="text-gray-900 font-medium">
          {{ formatDate(manga.startDate) }}
        </span>
      </div>

      <div v-if="manga.endDate?.year" class="flex justify-between">
        <span class="text-gray-500 font-light">End Date</span>
        <span class="text-gray-900 font-medium">
          {{ formatDate(manga.endDate) }}
        </span>
      </div>
    </div>

    <div v-if="manga.genres?.length">
      <h4 class="text-gray-500 font-light mb-3">Genres</h4>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="genre in manga.genres"
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
import type { Manga } from "@/services/anilist-manga";

defineProps<{
  manga: Manga;
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
