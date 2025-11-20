<template>
  <section class="w-full">
    <div class="flex flex-col px-12">
      <h2 class="text-lg font-light text-gray-900 tracking-wide text-center mb-8">Popular Manga</h2>
      <div class="flex gap-12 flex-wrap justify-center">
        <MangaCard v-for="manga in mangas" :key="manga.id" :manga="manga" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import MangaCard from "@/components/ui/manga-card.vue";
import { useMangaList } from "@/composables/useMangaList";

const { mangas, fetchPopular } = useMangaList();
const emit = defineEmits<{ loaded: [] }>();

onMounted(async () => {
  await fetchPopular(1, 6);
  emit("loaded");
});
</script>
