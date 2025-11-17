import { ref, computed } from "vue";
import { aniListService, type Anime, type AniListError } from "@/services/anilist";

interface UseAnimeSearchState {
  animes: Anime[];
  loading: boolean;
  error: AniListError | null;
  page: number;
  hasNextPage: boolean;
}

export function useAnimeSearch() {
  const state = ref<UseAnimeSearchState>({
    animes: [],
    loading: false,
    error: null,
    page: 1,
    hasNextPage: false,
  });

  const isLoading = computed(() => state.value.loading);
  const hasError = computed(() => state.value.error !== null);
  const animeList = computed(() => state.value.animes);
  const currentPage = computed(() => state.value.page);
  const canLoadMore = computed(() => state.value.hasNextPage);

  const search = async (query: string, page: number = 1, perPage: number = 10) => {
    state.value.loading = true;
    state.value.error = null;

    try {
      const results = await aniListService.searchAnime(query, page, perPage);
      state.value.animes = results;
      state.value.page = page;
    } catch (err) {
      state.value.error = err as AniListError;
    } finally {
      state.value.loading = false;
    }
  };

  const reset = () => {
    state.value.animes = [];
    state.value.page = 1;
    state.value.error = null;
  };

  return {
    animes: animeList,
    loading: isLoading,
    error: hasError,
    page: currentPage,
    canLoadMore,
    search,
    reset,
  };
}
