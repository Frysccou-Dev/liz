<template>
  <div class="min-h-screen bg-white">
    <Loader ref="loaderRef" />

    <div v-if="manga" class="animate-fade-in">
      <MangaHeader :manga="manga" />

      <div class="max-w-7xl mx-auto px-4 py-12">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div class="lg:col-span-3">
            <MangaInfo :manga="manga" />
          </div>

          <div class="lg:col-span-9 flex flex-col gap-12">
            <div class="prose prose-gray max-w-none">
              <h3 class="text-xl font-medium text-gray-900 mb-4">Synopsis</h3>
              <div
                v-html="sanitizedDescription"
                class="text-gray-600 font-light leading-relaxed"
              ></div>
            </div>

            <MangaCharacters
              v-if="manga.characters?.edges.length"
              :characters="manga.characters.edges"
            />

            <MangaRelations
              v-if="manga.relations?.edges.length"
              :relations="manga.relations.edges"
            />

            <div v-if="manga.recommendations?.nodes.length">
              <h3 class="text-xl font-medium text-gray-900 mb-6">Recommendations</h3>
              <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                <router-link
                  v-for="rec in manga.recommendations.nodes"
                  :key="rec.mediaRecommendation?.id"
                  :to="`/${rec.mediaRecommendation?.type?.toLowerCase() || 'manga'}/${
                    rec.mediaRecommendation?.id
                  }`"
                  class="group"
                >
                  <div class="aspect-2/3 rounded-lg overflow-hidden mb-2">
                    <img
                      :src="rec.mediaRecommendation?.coverImage?.large"
                      :alt="rec.mediaRecommendation?.title?.romaji"
                      class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <p
                    class="text-sm text-gray-700 font-medium line-clamp-2 group-hover:text-gray-900"
                  >
                    {{ rec.mediaRecommendation?.title?.romaji }}
                  </p>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import { useRoute } from "vue-router";
import { aniListMangaService, type Manga } from "@/services/anilist-manga";
import { sanitizeHtml } from "@/utils/sanitize";
import Loader from "@/components/layout/loader.vue";
import MangaHeader from "./components/manga-header.vue";
import MangaInfo from "./components/manga-info.vue";
import MangaCharacters from "./components/manga-characters.vue";
import MangaRelations from "./components/manga-relations.vue";

const route = useRoute();
const loaderRef = ref<InstanceType<typeof Loader>>();
const manga = ref<Manga | null>(null);

const sanitizedDescription = computed(() => sanitizeHtml(manga.value?.description));

const fetchManga = async (id: number) => {
  if (loaderRef.value) loaderRef.value.showLoader();
  try {
    manga.value = await aniListMangaService.getMangaById(id);
    window.scrollTo(0, 0);
  } catch (error) {
    console.error(error);
  } finally {
    if (loaderRef.value) loaderRef.value.hideLoader();
  }
};

onMounted(() => {
  const id = Number(route.params.id);
  if (id) fetchManga(id);
});

watch(
  () => route.params.id,
  (newId) => {
    if (newId) fetchManga(Number(newId));
  },
);
</script>
