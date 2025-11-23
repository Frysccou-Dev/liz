<template>
  <Loader ref="loaderRef" />
  <div class="w-full min-h-screen">
    <main class="w-full py-8">
      <PageTitle title="Mangas" />
      <MangaFilter @search="handleSearch" />

      <div v-if="isSearching" class="w-full px-4 md:px-12 animate-fade-in">
        <div class="w-[min(1100px,100%)] mx-auto">
          <div class="flex justify-between items-center mb-8">
            <h2 class="text-2xl font-light text-gray-900 tracking-wide">Search Results</h2>
            <button
              @click="clearSearch"
              class="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              Clear filters
            </button>
          </div>

          <div
            v-if="searchResults.length > 0"
            class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 justify-items-center"
          >
            <MangaCard
              v-for="manga in searchResults"
              :key="manga.id"
              :manga="manga"
              class="w-full"
            />
          </div>

          <div v-else class="flex flex-col items-center justify-center py-20 text-gray-500">
            <p class="text-lg font-light">No results found</p>
            <p class="text-sm mt-2">Try adjusting the filters</p>
          </div>

          <div v-if="searchResults.length > 0" class="flex justify-center gap-4 mt-12">
            <button
              @click="changePage(currentPage - 1)"
              :disabled="currentPage === 1"
              class="px-6 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              Previous
            </button>
            <span class="flex items-center text-gray-600 font-light"> Page {{ currentPage }} </span>
            <button
              @click="changePage(currentPage + 1)"
              :disabled="!hasNextPage"
              class="px-6 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <div v-else class="sections-container animate-fade-in">
        <PopularMangaList @loaded="onComponentLoaded" />
        <TrendingMangaList @loaded="onComponentLoaded" />
        <TopRatedMangaList @loaded="onComponentLoaded" />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import Loader from "@/components/layout/loader.vue";
import PageTitle from "@/components/ui/page-title.vue";
import MangaFilter from "@/components/features/manga-filter.vue";
import MangaCard from "@/components/ui/manga-card.vue";
import PopularMangaList from "./components/popular-manga-list.vue";
import TrendingMangaList from "./components/trending-manga-list.vue";
import TopRatedMangaList from "./components/top-rated-manga-list.vue";
import { aniListMangaService, type Manga, type SearchFilters } from "@/services/anilist-manga";

const loaderRef = ref<InstanceType<typeof Loader>>();
let loadedComponents = 0;
const totalComponents = 3;

const isSearching = ref(false);
const searchResults = ref<Manga[]>([]);
const currentPage = ref(1);
const hasNextPage = ref(false);
const currentFilters = ref<SearchFilters>({});

const onComponentLoaded = () => {
  loadedComponents++;
  if (loadedComponents === totalComponents && loaderRef.value) {
    loaderRef.value.hideLoader();
  }
};

const handleSearch = async (filters: SearchFilters) => {
  const hasFilters = Object.values(filters).some((val) => {
    if (Array.isArray(val)) return val.length > 0;
    return val !== "" && val !== undefined && val !== null;
  });

  if (!hasFilters) {
    clearSearch();
    return;
  }

  isSearching.value = true;
  currentFilters.value = filters;
  currentPage.value = 1;
  await fetchResults();
};

const fetchResults = async () => {
  if (loaderRef.value) loaderRef.value.showLoader();
  try {
    const results = await aniListMangaService.searchAdvanced(
      currentFilters.value,
      currentPage.value,
      15
    );
    searchResults.value = results;
    hasNextPage.value = results.length === 15;
  } catch (error) {
    console.error(error);
    searchResults.value = [];
  } finally {
    if (loaderRef.value) loaderRef.value.hideLoader();
  }
};

const changePage = async (page: number) => {
  currentPage.value = page;
  await fetchResults();
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const clearSearch = () => {
  isSearching.value = false;
  searchResults.value = [];
  currentFilters.value = {};
  currentPage.value = 1;
};

onMounted(() => {
  if (loaderRef.value) loaderRef.value.showLoader();
});
</script>

<style scoped>
.sections-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
