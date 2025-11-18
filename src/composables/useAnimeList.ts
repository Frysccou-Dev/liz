import { ref, computed } from "vue";
import { aniListService, type Anime, type AniListError } from "@/services/anilist";

interface UseAnimeListState {
  animes: Anime[];
  loading: boolean;
  error: AniListError | null;
  page: number;
  hasNextPage: boolean;
}

export function useAnimeList() {
  const state = ref<UseAnimeListState>({
    animes: [],
    loading: false,
    error: null,
    page: 1,
    hasNextPage: false,
  });

  const isLoading = computed(() => state.value.loading);
  const hasError = computed(() => state.value.error !== null);
  const animeList = computed(() => state.value.animes);
  const errorMessage = computed(() => state.value.error?.message || null);

  const fetchPopular = async (page: number = 1, perPage: number = 6) => {
    state.value.loading = true;
    state.value.error = null;

    try {
      const results = await aniListService.getPopularAnime(page, perPage);
      state.value.animes = [...results];
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

  const fetchPopularThisSeason = async (page: number = 1, perPage: number = 6) => {
    state.value.loading = true;
    state.value.error = null;

    try {
      const results = await aniListService.getPopularThisSeason(page, perPage);
      state.value.animes = [...results];
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
      const results = await aniListService.getTrendingAnime(page, perPage);
      state.value.animes = [...results];
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

  const fetchUpcomingNextSeason = async (page: number = 1, perPage: number = 6) => {
    state.value.loading = true;
    state.value.error = null;

    try {
      const results = await aniListService.getUpcomingNextSeason(page, perPage);
      state.value.animes = [...results];
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

  const fetchAllTimePopular = async (page: number = 1, perPage: number = 6) => {
    state.value.loading = true;
    state.value.error = null;

    try {
      const results = await aniListService.getAllTimePopular(page, perPage);
      state.value.animes = [...results];
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

  const fetchRecommended = async (page: number = 1, perPage: number = 6) => {
    state.value.loading = true;
    state.value.error = null;

    try {
      const results = await aniListService.getRecommendedAnime(page, perPage);
      state.value.animes = [...results];
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
    state.value.animes = [];
    state.value.page = 1;
    state.value.error = null;
  };

  return {
    animes: animeList,
    loading: isLoading,
    error: hasError,
    errorMessage,
    fetchPopular,
    fetchPopularThisSeason,
    fetchTrending,
    fetchUpcomingNextSeason,
    fetchAllTimePopular,
    fetchRecommended,
    reset,
  };
}
