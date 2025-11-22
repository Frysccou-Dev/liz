<template>
  <section class="w-full">
    <div class="flex flex-col px-0 md:px-12">
      <h2 class="text-lg font-light text-gray-900 tracking-wide text-center mb-8">
        All Time Popular
      </h2>
      <div
        class="flex overflow-x-auto snap-x snap-mandatory gap-4 px-4 pb-4 md:pb-0 md:px-0 md:flex-wrap md:justify-center md:gap-12 md:overflow-visible scrollbar-hide"
      >
        <AnimeCard
          v-for="anime in animes"
          :key="anime.id"
          :anime="anime"
          class="snap-center shrink-0"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import AnimeCard from "@/components/ui/anime-card.vue";
import { useAnimeList } from "@/composables/useAnimeList";

const { animes, fetchAllTimePopular } = useAnimeList();
const emit = defineEmits<{ loaded: [] }>();

onMounted(async () => {
  await fetchAllTimePopular(1, 6);
  emit("loaded");
});
</script>

<style scoped></style>
