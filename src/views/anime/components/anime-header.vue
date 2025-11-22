<template>
  <div class="relative w-full h-[40vh] md:h-[50vh]">
    <div class="absolute inset-0 overflow-hidden">
      <img
        v-if="anime.bannerImage"
        :src="anime.bannerImage"
        class="w-full h-full object-cover"
        alt="Banner"
      />
      <div v-else class="w-full h-full bg-gray-900 relative overflow-hidden">
        <img
          :src="anime.coverImage.extraLarge"
          class="w-full h-full object-cover opacity-30 blur-xl scale-110"
          alt="Banner Placeholder"
        />
      </div>
      <div class="absolute inset-0 bg-linear-to-t from-white via-white/20 to-transparent"></div>
    </div>

    <div class="absolute bottom-0 left-0 w-full px-4 pb-8 md:pb-12">
      <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-end gap-8">
        <div class="hidden md:block w-52 rounded-lg overflow-hidden shadow-2xl -mb-20 z-10">
          <img :src="anime.coverImage.extraLarge" :alt="anime.title.romaji" class="w-full h-auto" />
        </div>

        <div class="flex-1 mb-4">
          <h2
            class="text-2xl sm:text-3xl md:text-6xl font-bold text-white leading-tight mb-4 line-clamp-2 md:line-clamp-none"
          >
            {{ anime.title.romaji }}
          </h2>
          <div class="flex flex-wrap gap-4 text-sm font-medium text-gray-600">
            <span v-if="anime.seasonYear" class="px-3 py-1 bg-gray-100 rounded-full">
              {{ anime.seasonYear }}
            </span>
            <span v-if="anime.format" class="px-3 py-1 bg-gray-100 rounded-full">
              {{ anime.format }}
            </span>
            <span v-if="anime.status" class="px-3 py-1 bg-gray-100 rounded-full">
              {{ formatStatus(anime.status) }}
            </span>
          </div>

          <div class="mt-6">
            <MediaActions
              :media-id="anime.id"
              media-type="ANIME"
              :media-title="anime.title.romaji"
              :media-cover="anime.coverImage.large"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Anime } from "@/services/anilist";
import MediaActions from "@/components/features/media-actions.vue";

defineProps<{
  anime: Anime;
}>();

const formatStatus = (status: string) => {
  const map: Record<string, string> = {
    FINISHED: "Finalizado",
    RELEASING: "En Emisión",
    NOT_YET_RELEASED: "Próximamente",
    CANCELLED: "Cancelado",
    HIATUS: "En Pausa",
  };
  return map[status] || status;
};
</script>
