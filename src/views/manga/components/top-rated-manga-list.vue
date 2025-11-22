<template>
  <section class="w-full">
    <div class="flex flex-col px-0 md:px-12">
      <h2 class="text-lg font-light text-gray-900 tracking-wide text-center mb-8">Top Rated</h2>
      <div
        class="flex overflow-x-auto snap-x snap-mandatory gap-4 px-4 pb-4 md:pb-0 md:px-0 md:flex-wrap md:justify-center md:gap-12 md:overflow-visible scrollbar-hide"
      >
        <MangaCard
          v-for="manga in mangas"
          :key="manga.id"
          :manga="manga"
          class="snap-center shrink-0"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import MangaCard from "@/components/ui/manga-card.vue";
import { useMangaList } from "@/composables/useMangaList";

const { mangas, fetchTopRated } = useMangaList();
const emit = defineEmits<{ loaded: [] }>();

onMounted(async () => {
  await fetchTopRated(1, 6);
  emit("loaded");
});
</script>
