<template>
  <Loader ref="loaderRef" />
  <div class="min-h-screen bg-white">
    <section class="pt-16 pb-12 px-6">
      <div class="max-w-7xl mx-auto text-center">
        <span class="text-xs uppercase tracking-[0.3em] text-gray-400 mb-4 block">Explore</span>
        <h1 class="text-5xl md:text-6xl lg:text-7xl font-light text-gray-200 tracking-tight mb-6">
          Mangas
        </h1>
        <p class="text-gray-500 font-light max-w-lg mx-auto">
          Explore our extensive manga collection and track your reading journey
        </p>
      </div>
    </section>

    <section class="pb-8 px-6">
      <div class="max-w-5xl mx-auto">
        <MangaFilter @search="handleSearch" />
      </div>
    </section>

    <div v-if="isSearching" class="px-6 pb-24 animate-fade-in">
      <div class="max-w-7xl mx-auto">
        <div class="flex justify-between items-center mb-12 pt-8 border-t border-gray-100">
          <div>
            <span class="text-xs uppercase tracking-[0.2em] text-gray-400 block mb-2">Results</span>
            <h2 class="text-2xl font-light text-gray-900">Search Results</h2>
          </div>
          <button
            @click="clearSearch"
            class="px-4 py-2 text-sm text-gray-500 hover:text-gray-900 border border-gray-200 rounded-lg hover:border-gray-400 transition-all"
          >
            Clear filters
          </button>
        </div>

        <div
          v-if="searchResults.length > 0"
          class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6"
        >
          <MangaCard v-for="manga in searchResults" :key="manga.id" :manga="manga" class="w-full" />
        </div>

        <div v-else class="flex flex-col items-center justify-center py-24 text-center">
          <div class="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-6">
            <SearchIcon class="w-6 h-6 text-gray-400" />
          </div>
          <p class="text-xl font-light text-gray-900 mb-2">No results found</p>
          <p class="text-gray-500 font-light">Try adjusting your search filters</p>
        </div>

        <div v-if="searchResults.length > 0" class="flex justify-center items-center gap-4 mt-16">
          <button
            @click="changePage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="px-6 py-3 rounded-lg border border-gray-200 bg-white text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed hover:border-gray-400 transition-all"
          >
            Previous
          </button>
          <span class="px-4 py-2 text-gray-500 font-light">Page {{ currentPage }}</span>
          <button
            @click="changePage(currentPage + 1)"
            :disabled="!hasNextPage"
            class="px-6 py-3 rounded-lg border border-gray-200 bg-white text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed hover:border-gray-400 transition-all"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <div v-else class="pb-24 animate-fade-in">
      <section class="py-16 px-6">
        <div class="max-w-7xl mx-auto">
          <div class="mb-12">
            <span class="text-xs uppercase tracking-[0.2em] text-gray-400 block mb-2"
              >Trending</span
            >
            <h2 class="text-2xl font-light text-gray-900">Popular Manga</h2>
          </div>
          <div
            class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6"
          >
            <MangaCard v-for="manga in popularMangas" :key="manga.id" :manga="manga" />
          </div>
        </div>
      </section>

      <section class="py-16 px-6 bg-gray-50">
        <div class="max-w-7xl mx-auto">
          <div class="mb-12">
            <span class="text-xs uppercase tracking-[0.2em] text-gray-400 block mb-2"
              >Hot Right Now</span
            >
            <h2 class="text-2xl font-light text-gray-900">Trending Manga</h2>
          </div>
          <div
            class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6"
          >
            <MangaCard v-for="manga in trendingMangas" :key="manga.id" :manga="manga" />
          </div>
        </div>
      </section>

      <section class="py-16 px-6">
        <div class="max-w-7xl mx-auto">
          <div class="mb-12">
            <span class="text-xs uppercase tracking-[0.2em] text-gray-400 block mb-2"
              >Best of All Time</span
            >
            <h2 class="text-2xl font-light text-gray-900">Top Rated Manga</h2>
          </div>
          <div
            class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6"
          >
            <MangaCard v-for="manga in topRatedMangas" :key="manga.id" :manga="manga" />
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { Search as SearchIcon } from "lucide-vue-next";
import Loader from "@/components/layout/loader.vue";
import MangaFilter from "@/components/features/manga-filter.vue";
import MangaCard from "@/components/ui/manga-card.vue";
import { aniListMangaService, type Manga, type SearchFilters } from "@/services/anilist-manga";

const loaderRef = ref<InstanceType<typeof Loader>>();
let safetyTimeout: ReturnType<typeof setTimeout> | null = null;

const popularMangas = ref<Manga[]>([]);
const trendingMangas = ref<Manga[]>([]);
const topRatedMangas = ref<Manga[]>([]);

const isSearching = ref(false);
const searchResults = ref<Manga[]>([]);
const currentPage = ref(1);
const hasNextPage = ref(false);
const currentFilters = ref<SearchFilters>({});

const hideLoaderSafely = () => {
  if (safetyTimeout) {
    clearTimeout(safetyTimeout);
    safetyTimeout = null;
  }
  if (loaderRef.value) {
    loaderRef.value.hideLoader();
  }
};

const fetchAllData = async () => {
  if (loaderRef.value) loaderRef.value.showLoader();

  try {
    const [popular, trending, topRated] = await Promise.all([
      aniListMangaService.getPopularManga(1, 6),
      aniListMangaService.getTrendingManga(1, 6),
      aniListMangaService.getTopRatedManga(1, 6),
    ]);

    popularMangas.value = popular;
    trendingMangas.value = trending;
    topRatedMangas.value = topRated;
  } catch (error) {
    console.error(error);
  } finally {
    hideLoaderSafely();
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
      18,
    );
    searchResults.value = results;
    hasNextPage.value = results.length === 18;
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
  safetyTimeout = setTimeout(() => {
    hideLoaderSafely();
  }, 10000);
  fetchAllData();
});

onUnmounted(() => {
  if (safetyTimeout) {
    clearTimeout(safetyTimeout);
  }
});
</script>
