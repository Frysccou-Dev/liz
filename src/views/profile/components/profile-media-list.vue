<template>
  <div class="space-y-8 animate-fade-in" style="animation-delay: 0.1s">
    <div v-for="status in mediaStatuses" :key="status" class="space-y-4">
      <h3 class="text-lg font-medium text-gray-900 capitalize">{{ formatStatus(status) }}</h3>
      <div
        v-if="loading"
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
      >
        <div v-for="n in 5" :key="n" class="bg-gray-200 rounded-xl h-48 animate-pulse"></div>
      </div>
      <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <div
          v-for="item in getMediaByStatus(mediaList, status)"
          :key="item.id"
          @click="
            $emit(
              'go-to-media',
              (item as any).anime_id || (item as any).manga_id,
              type === 'anime' ? 'ANIME' : 'MANGA'
            )
          "
          class="group relative aspect-2/3 bg-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer"
        >
          <img
            v-if="item.media_cover"
            :src="item.media_cover"
            :alt="item.media_title"
            class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
            No Cover
          </div>
          <div
            class="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4"
          >
            <h4 class="text-white text-sm font-medium line-clamp-2">{{ item.media_title }}</h4>
            <div class="flex items-center gap-2 mt-2">
              <span class="text-xs text-gray-300">{{ item.score ? item.score + "/10" : "-" }}</span>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="!loading && getMediaByStatus(mediaList, status).length === 0"
        class="text-sm text-gray-400 italic"
      >
        No items in this category
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MediaStatus } from "@/services/user-lists";

defineProps<{
  mediaList: MediaStatus[];
  loading: boolean;
  type: "anime" | "manga";
  mediaStatuses: string[];
}>();

defineEmits<{
  (e: "go-to-media", id: number, type: string): void;
}>();

const getMediaByStatus = (list: MediaStatus[], status: string) => {
  return list.filter((item) => item.status && item.status.toUpperCase() === status);
};

const formatStatus = (status: string) => {
  return status
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
};
</script>
