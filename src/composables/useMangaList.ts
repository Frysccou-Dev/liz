import { ref, computed } from "vue";
import { aniListMangaService, type Manga, type AniListError } from "@/services/anilist-manga";

interface UseMangaListState {
  mangas: Manga[];
  loading: boolean;
  error: AniListError | null;
  page: number;
  hasNextPage: boolean;
}

export function useMangaList() {
  const state = ref<UseMangaListState>({
    mangas: [],
    loading: false,
    error: null,
    page: 1,
    hasNextPage: false,
  });

  const isLoading = computed(() => state.value.loading);
  const hasError = computed(() => state.value.error !== null);
  const mangaList = computed(() => state.value.mangas);
  const errorMessage = computed(() => state.value.error?.message || null);

  const fetchPopular = async (page: number = 1, perPage: number = 6) => {
    state.value.loading = true;
    state.value.error = null;

    try {
      const results = await aniListMangaService.getPopularManga(page, perPage);
      state.value.mangas = [...results];
      state.value.page = page;
    } catch (err) {
      state.value.error = err as AniListError;
      if ((err as AniListError).status === 429) {
        window.showRateLimitModal(10000);
      }
    } finally {
      state.value.loading = false;
    }
  };

  const fetchTrending = async (page: number = 1, perPage: number = 6) => {
    state.value.loading = true;
    state.value.error = null;

    try {
      const results = await aniListMangaService.getTrendingManga(page, perPage);
      state.value.mangas = [...results];
      state.value.page = page;
    } catch (err) {
      state.value.error = err as AniListError;
      if ((err as AniListError).status === 429) {
        window.showRateLimitModal(10000);
      }
    } finally {
      state.value.loading = false;
    }
  };

  const fetchTopRated = async (page: number = 1, perPage: number = 6) => {
    state.value.loading = true;
    state.value.error = null;

    try {
      const results = await aniListMangaService.getTopRatedManga(page, perPage);
      state.value.mangas = [...results];
      state.value.page = page;
    } catch (err) {
      state.value.error = err as AniListError;
      if ((err as AniListError).status === 429) {
        window.showRateLimitModal(10000);
      }
    } finally {
      state.value.loading = false;
    }
  };

  const reset = () => {
    state.value.mangas = [];
    state.value.page = 1;
    state.value.error = null;
  };

  return {
    mangas: mangaList,
    loading: isLoading,
    error: hasError,
    errorMessage,
    fetchPopular,
    fetchTrending,
    fetchTopRated,
    reset,
  };
}
