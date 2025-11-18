<template>
  <section class="w-full">
    <div class="flex flex-col px-12">
      <h2 class="text-lg font-light text-gray-900 tracking-wide text-center mb-8">
        Próximos Estrenos
      </h2>
      <div class="flex gap-12 flex-wrap justify-center">
        <AnimeCard v-for="anime in animes" :key="anime.id" :anime="anime" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import AnimeCard from "@/components/ui/anime-card.vue";
import { useAnimeList } from "@/composables/useAnimeList";

const { animes, fetchUpcomingNextSeason } = useAnimeList();
const emit = defineEmits<{ loaded: [] }>();

onMounted(async () => {
  await fetchUpcomingNextSeason(1, 6);
  emit("loaded");
});
</script>

<style scoped></style>
