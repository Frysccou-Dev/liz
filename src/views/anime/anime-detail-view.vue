<template>
  <div class="min-h-screen bg-white">
    <Loader ref="loaderRef" />

    <div v-if="anime" class="animate-fade-in">
      <AnimeHeader :anime="anime" />

      <div class="max-w-7xl mx-auto px-4 py-12">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div class="lg:col-span-3">
            <AnimeInfo :anime="anime" />
          </div>

          <div class="lg:col-span-9 flex flex-col gap-12">
            <div class="prose prose-gray max-w-none">
              <h3 class="text-xl font-medium text-gray-900 mb-4">Synopsis</h3>
              <div
                v-html="anime.description"
                class="text-gray-600 font-light leading-relaxed"
              ></div>
            </div>

            <AnimeCharacters
              v-if="anime.characters?.edges.length"
              :characters="anime.characters.edges"
            />

            <AnimeRelations
              v-if="anime.relations?.edges.length"
              :relations="anime.relations.edges"
            />

            <div v-if="anime.recommendations?.nodes.length">
              <h3 class="text-xl font-medium text-gray-900 mb-6">Recommendations</h3>
              <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                <router-link
                  v-for="rec in anime.recommendations.nodes"
                  :key="rec.mediaRecommendation?.id"
                  :to="`/anime/${rec.mediaRecommendation?.id}`"
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
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { aniListService, type Anime } from "@/services/anilist";
import Loader from "@/components/layout/loader.vue";
import AnimeHeader from "./components/anime-header.vue";
import AnimeInfo from "./components/anime-info.vue";
import AnimeCharacters from "./components/anime-characters.vue";
import AnimeRelations from "./components/anime-relations.vue";

const route = useRoute();
const loaderRef = ref<InstanceType<typeof Loader>>();
const anime = ref<Anime | null>(null);

const fetchAnime = async (id: number) => {
  if (loaderRef.value) loaderRef.value.showLoader();
  try {
    anime.value = await aniListService.getAnimeById(id);
    window.scrollTo(0, 0);
  } catch (error) {
    console.error(error);
  } finally {
    if (loaderRef.value) loaderRef.value.hideLoader();
  }
};

onMounted(() => {
  const id = Number(route.params.id);
  if (id) fetchAnime(id);
});

watch(
  () => route.params.id,
  (newId) => {
    if (newId) fetchAnime(Number(newId));
  }
);
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
