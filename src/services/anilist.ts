import axios from "axios";
import type { AxiosInstance } from "axios";

interface AniListError {
  message: string;
  status?: number;
}

interface Anime {
  id: number;
  title: {
    romaji: string;
    english?: string;
    native?: string;
  };
  coverImage: {
    extraLarge: string;
    large: string;
    medium: string;
  };
  description?: string;
  averageScore?: number;
  popularity?: number;
  episodes?: number;
  duration?: number;
  season?: string;
  seasonYear?: number;
  status?: string;
  type?: string;
  format?: string;
  genres?: string[];
  bannerImage?: string;
  studios?: {
    nodes: {
      name: string;
    }[];
  };
  startDate?: {
    year: number;
    month: number;
    day: number;
  };
  endDate?: {
    year: number;
    month: number;
    day: number;
  };
  characters?: {
    edges: {
      role: string;
      node: {
        id: number;
        name: {
          full: string;
        };
        image: {
          large: string;
        };
      };
    }[];
  };
  relations?: {
    edges: {
      relationType: string;
      node: Anime;
    }[];
  };
  recommendations?: {
    nodes: {
      mediaRecommendation: Anime;
    }[];
  };
  nextAiringEpisode?: {
    airingAt: number;
    timeUntilAiring: number;
    episode: number;
  };
}

interface AniListAnimeResponse {
  data: {
    Page?: {
      pageInfo: {
        hasNextPage: boolean;
        total: number;
      };
      media: Anime[];
    };
    Media?: Anime;
  };
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

interface SearchFilters {
  search?: string;
  genre?: string[];
  year?: number;
  season?: string;
  format?: string[];
  status?: string;
}

class AniListService {
  private client: AxiosInstance;
  private baseURL = import.meta.env.DEV ? "/api" : "https://graphql.anilist.co";
  private readonly CACHE_DURATION = 30 * 60 * 1000;
  private readonly STORAGE_PREFIX = "anilist_cache_v3_";

  constructor() {
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  private generateCacheKey(method: string, page: number, perPage: number, search?: string): string {
    return `${method}:${page}:${perPage}${search ? `:${search}` : ""}`;
  }

  private isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.CACHE_DURATION;
  }

  private getCachedData<T>(key: string): T | null {
    try {
      const storageKey = this.STORAGE_PREFIX + key;
      const cached = localStorage.getItem(storageKey);
      if (!cached) return null;

      const entry: CacheEntry<T> = JSON.parse(cached);
      if (this.isCacheValid(entry.timestamp)) {
        return entry.data;
      }
      localStorage.removeItem(storageKey);
      return null;
    } catch {
      return null;
    }
  }

  private setCacheData<T>(key: string, data: T): void {
    try {
      const storageKey = this.STORAGE_PREFIX + key;
      const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
      };
      localStorage.setItem(storageKey, JSON.stringify(entry));
    } catch {
      // Fail silently if localStorage is unavailable
    }
  }

  private getQueryString(page: number = 1, perPage: number = 10, search?: string): string {
    const searchFilter = search ? `, search: "${search}"` : "";
    return `
      query {
        Page(page: ${page}, perPage: ${perPage}) {
          pageInfo {
            hasNextPage
            total
          }
          media(type: ANIME, isAdult: false${searchFilter}) {
            id
            title {
              romaji
              english
              native
            }
            coverImage {
              large
              medium
            }
            description
            averageScore
            popularity
            episodes
            season
            seasonYear
            status
          }
        }
      }
    `;
  }

  async searchAnime(query: string, page: number = 1, perPage: number = 10): Promise<Anime[]> {
    try {
      const cacheKey = this.generateCacheKey("search", page, perPage, query);
      const cached = this.getCachedData<Anime[]>(cacheKey);
      if (cached) return cached;

      const response = await this.client.post<AniListAnimeResponse>("", {
        query: this.getQueryString(page, perPage, query),
      });

      const dataPage = response.data.data.Page;
      if (dataPage?.media) {
        this.setCacheData(cacheKey, dataPage.media);
        return dataPage.media;
      }
      return [];
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getPopularAnime(page: number = 1, perPage: number = 5): Promise<Anime[]> {
    try {
      const cacheKey = this.generateCacheKey("popular", page, perPage);
      const cached = this.getCachedData<Anime[]>(cacheKey);
      if (cached) return cached;

      const response = await this.client.post<AniListAnimeResponse>("", {
        query: `
          query {
            Page(page: ${page}, perPage: ${perPage}) {
              pageInfo {
                hasNextPage
                total
              }
              media(type: ANIME, isAdult: false, sort: POPULARITY_DESC) {
                id
                title {
                  romaji
                  english
                  native
                }
                coverImage {
                  large
                  medium
                }
                description
                averageScore
                popularity
                episodes
                season
                seasonYear
                status
              }
            }
          }
        `,
      });

      const dataPage = response.data.data.Page;
      if (dataPage?.media) {
        this.setCacheData(cacheKey, dataPage.media);
        return dataPage.media;
      }
      return [];
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getPopularThisSeason(page: number = 1, perPage: number = 6): Promise<Anime[]> {
    try {
      const cacheKey = this.generateCacheKey("popularSeason", page, perPage);
      const cached = this.getCachedData<Anime[]>(cacheKey);
      if (cached) return cached;

      const response = await this.client.post<AniListAnimeResponse>("", {
        query: `
          query {
            Page(page: ${page}, perPage: ${perPage}) {
              pageInfo {
                hasNextPage
                total
              }
              media(type: ANIME, isAdult: false, season: FALL, seasonYear: 2025, sort: POPULARITY_DESC) {
                id
                title {
                  romaji
                  english
                  native
                }
                coverImage {
                  extraLarge
                  large
                  medium
                }
                description
                averageScore
                popularity
                episodes
                season
                seasonYear
                status
              }
            }
          }
        `,
      });

      const dataPage = response.data.data.Page;
      if (dataPage?.media) {
        this.setCacheData(cacheKey, dataPage.media);
        return dataPage.media;
      }
      return [];
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getTrendingAnime(page: number = 1, perPage: number = 6): Promise<Anime[]> {
    try {
      const cacheKey = this.generateCacheKey("trending", page, perPage);
      const cached = this.getCachedData<Anime[]>(cacheKey);
      if (cached) return cached;

      const response = await this.client.post<AniListAnimeResponse>("", {
        query: `
          query {
            Page(page: ${page}, perPage: ${perPage}) {
              pageInfo {
                hasNextPage
                total
              }
              media(type: ANIME, isAdult: false, sort: TRENDING_DESC) {
                id
                title {
                  romaji
                  english
                  native
                }
                coverImage {
                  extraLarge
                  large
                  medium
                }
                description
                averageScore
                popularity
                episodes
                season
                seasonYear
                status
              }
            }
          }
        `,
      });

      const dataPage = response.data.data.Page;
      if (dataPage?.media) {
        this.setCacheData(cacheKey, dataPage.media);
        return dataPage.media;
      }
      return [];
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getUpcomingNextSeason(page: number = 1, perPage: number = 6): Promise<Anime[]> {
    try {
      const cacheKey = this.generateCacheKey("upcoming", page, perPage);
      const cached = this.getCachedData<Anime[]>(cacheKey);
      if (cached) return cached;

      const response = await this.client.post<AniListAnimeResponse>("", {
        query: `
          query {
            Page(page: ${page}, perPage: ${perPage}) {
              pageInfo {
                hasNextPage
                total
              }
              media(type: ANIME, isAdult: false, season: WINTER, seasonYear: 2026, sort: POPULARITY_DESC) {
                id
                title {
                  romaji
                  english
                  native
                }
                coverImage {
                  extraLarge
                  large
                  medium
                }
                description
                averageScore
                popularity
                episodes
                season
                seasonYear
                status
              }
            }
          }
        `,
      });

      const dataPage = response.data.data.Page;
      if (dataPage?.media) {
        this.setCacheData(cacheKey, dataPage.media);
        return dataPage.media;
      }
      return [];
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getAllTimePopular(page: number = 1, perPage: number = 6): Promise<Anime[]> {
    try {
      const cacheKey = this.generateCacheKey("allPopular", page, perPage);
      const cached = this.getCachedData<Anime[]>(cacheKey);
      if (cached) return cached;

      const response = await this.client.post<AniListAnimeResponse>("", {
        query: `
          query {
            Page(page: ${page}, perPage: ${perPage}) {
              pageInfo {
                hasNextPage
                total
              }
              media(type: ANIME, isAdult: false, sort: POPULARITY_DESC) {
                id
                title {
                  romaji
                  english
                  native
                }
                coverImage {
                  extraLarge
                  large
                  medium
                }
                description
                averageScore
                popularity
                episodes
                season
                seasonYear
                status
              }
            }
          }
        `,
      });

      const dataPage = response.data.data.Page;
      if (dataPage?.media) {
        this.setCacheData(cacheKey, dataPage.media);
        return dataPage.media;
      }
      return [];
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getRecommendedAnime(page: number = 1, perPage: number = 6): Promise<Anime[]> {
    try {
      const cacheKey = this.generateCacheKey("recommended", page, perPage);
      const cached = this.getCachedData<Anime[]>(cacheKey);
      if (cached) return cached;

      const response = await this.client.post<AniListAnimeResponse>("", {
        query: `
          query {
            Page(page: ${page}, perPage: ${perPage}) {
              pageInfo {
                hasNextPage
                total
              }
              media(type: ANIME, isAdult: false, sort: SCORE_DESC) {
                id
                title {
                  romaji
                  english
                  native
                }
                coverImage {
                  large
                  medium
                }
                description
                averageScore
                popularity
                episodes
                season
                seasonYear
                status
              }
            }
          }
        `,
      });

      const dataPage = response.data.data.Page;
      if (dataPage?.media) {
        this.setCacheData(cacheKey, dataPage.media);
        return dataPage.media;
      }
      return [];
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getGenres(): Promise<string[]> {
    try {
      const cacheKey = "genres";
      const cached = this.getCachedData<string[]>(cacheKey);
      if (cached) return cached;

      const response = await this.client.post<{ data: { GenreCollection: string[] } }>("", {
        query: `
          query {
            GenreCollection
          }
        `,
      });

      if (response.data.data.GenreCollection) {
        this.setCacheData(cacheKey, response.data.data.GenreCollection);
        return response.data.data.GenreCollection;
      }
      return [];
    } catch (error) {
      throw this.handleError(error);
    }
  }

  clearCache(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith(this.STORAGE_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    } catch {
      // Fail silently if localStorage is unavailable
    }
  }

  private handleError(error: unknown): AniListError {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const message = error.response?.data?.errors?.[0]?.message || error.message;
      return { message, status };
    }
    return { message: "An unknown error occurred" };
  }
  async searchAdvanced(
    filters: SearchFilters,
    page: number = 1,
    perPage: number = 15
  ): Promise<Anime[]> {
    try {
      const cacheKey = this.generateCacheKey(
        "advancedSearch",
        page,
        perPage,
        JSON.stringify(filters)
      );
      const cached = this.getCachedData<Anime[]>(cacheKey);
      if (cached) return cached;

      const queryParts = [];
      if (filters.search) queryParts.push(`search: "${filters.search}"`);
      if (filters.genre && filters.genre.length > 0) {
        const genres = filters.genre.map((g) => `"${g}"`).join(", ");
        queryParts.push(`genre_in: [${genres}]`);
      } else {
        queryParts.push(`genre_not_in: ["Hentai"]`);
      }
      if (filters.year) queryParts.push(`seasonYear: ${filters.year}`);
      if (filters.season) queryParts.push(`season: ${filters.season}`);
      if (filters.format && filters.format.length > 0) {
        const formats = filters.format.map((f) => `"${f}"`).join(", ");
        queryParts.push(`format_in: [${formats}]`);
      }
      if (filters.status) queryParts.push(`status: ${filters.status}`);

      const filterString = queryParts.length > 0 ? `, ${queryParts.join(", ")}` : "";

      const response = await this.client.post<AniListAnimeResponse>("", {
        query: `
          query {
            Page(page: ${page}, perPage: ${perPage}) {
              pageInfo {
                hasNextPage
                total
              }
              media(type: ANIME, isAdult: false${filterString}, sort: POPULARITY_DESC) {
                id
                title {
                  romaji
                  english
                  native
                }
                coverImage {
                  extraLarge
                  large
                  medium
                }
                description
                averageScore
                popularity
                episodes
                season
                seasonYear
                status
                format
                genres
              }
            }
          }
        `,
      });

      const dataPage = response.data.data.Page;
      if (dataPage?.media) {
        this.setCacheData(cacheKey, dataPage.media);
        return dataPage.media;
      }
      return [];
    } catch (error) {
      throw this.handleError(error);
    }
  }
  async getAnimeById(id: number): Promise<Anime> {
    try {
      const cacheKey = this.generateCacheKey("anime_detail", id, 1);
      const cached = this.getCachedData<Anime>(cacheKey);
      if (cached) return cached;

      const response = await this.client.post<AniListAnimeResponse>("", {
        query: `
          query {
            Media(id: ${id}, type: ANIME) {
              id
              title {
                romaji
                english
                native
              }
              coverImage {
                extraLarge
                large
                medium
              }
              bannerImage
              description
              averageScore
              popularity
              episodes
              duration
              season
              seasonYear
              status
              format
              genres
              studios {
                nodes {
                  name
                }
              }
              startDate {
                year
                month
                day
              }
              endDate {
                year
                month
                day
              }
              characters(sort: ROLE, perPage: 10) {
                edges {
                  role
                  node {
                    id
                    name {
                      full
                    }
                    image {
                      large
                    }
                  }
                }
              }
              relations {
                edges {
                  relationType
                  node {
                    id
                    title {
                      romaji
                    }
                    coverImage {
                      medium
                    }
                    type
                  }
                }
              }
              recommendations(perPage: 7, sort: RATING_DESC) {
                nodes {
                  mediaRecommendation {
                    id
                    title {
                      romaji
                    }
                    coverImage {
                      large
                    }
                    type
                  }
                }
              }
              nextAiringEpisode {
                airingAt
                timeUntilAiring
                episode
              }
            }
          }
        `,
      });

      if (response.data.data.Media) {
        this.setCacheData(cacheKey, response.data.data.Media);
        return response.data.data.Media;
      }
      throw new Error("Anime not found");
    } catch (error) {
      throw this.handleError(error);
    }
  }
}

export const aniListService = new AniListService();
export type { Anime, AniListError, AniListAnimeResponse, SearchFilters };
