<template>
  <div class="relative w-full h-[40vh] md:h-[50vh]">
    <div class="absolute inset-0 overflow-hidden">
      <img
        v-if="manga.bannerImage"
        :src="manga.bannerImage"
        class="w-full h-full object-cover"
        alt="Banner"
      />
      <div v-else class="w-full h-full bg-gray-900 relative overflow-hidden">
        <img
          :src="manga.coverImage.extraLarge"
          class="w-full h-full object-cover opacity-30 blur-xl scale-110"
          alt="Banner Placeholder"
        />
      </div>
      <div class="absolute inset-0 bg-linear-to-t from-white via-white/20 to-transparent"></div>
    </div>

    <div class="absolute bottom-0 left-0 w-full px-4 pb-8 md:pb-12">
      <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-end gap-8">
        <div class="hidden md:block w-52 rounded-lg overflow-hidden shadow-2xl -mb-20 z-10">
          <img :src="manga.coverImage.extraLarge" :alt="manga.title.romaji" class="w-full h-auto" />
        </div>

        <div class="flex-1 mb-4">
          <h2
            class="text-2xl sm:text-3xl md:text-6xl font-bold text-white leading-tight mb-4 line-clamp-2 md:line-clamp-none"
          >
            {{ manga.title.romaji }}
          </h2>
          <div class="flex flex-wrap gap-4 text-sm font-medium text-gray-600">
            <span v-if="manga.startDate?.year" class="px-3 py-1 bg-gray-100 rounded-full">
              {{ manga.startDate.year }}
            </span>
            <span v-if="manga.format" class="px-3 py-1 bg-gray-100 rounded-full">
              {{ formatFormat(manga.format) }}
            </span>
            <span v-if="manga.status" class="px-3 py-1 bg-gray-100 rounded-full">
              {{ formatStatus(manga.status) }}
            </span>
          </div>

          <div class="mt-6">
            <MediaActions
              :media-id="manga.id"
              media-type="MANGA"
              :media-title="manga.title.romaji"
              :media-cover="manga.coverImage.large"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Manga } from "@/services/anilist-manga";
import MediaActions from "@/components/features/media-actions.vue";

defineProps<{
  manga: Manga;
}>();

const formatStatus = (status: string) => {
  const map: Record<string, string> = {
    FINISHED: "Finished",
    RELEASING: "Releasing",
    NOT_YET_RELEASED: "Not Yet Released",
    CANCELLED: "Cancelled",
    HIATUS: "Hiatus",
  };
  return map[status] || status;
};

const formatFormat = (format: string) => {
  return format.replace(/_/g, " ");
};
</script>
