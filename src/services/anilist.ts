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
  season?: string;
  seasonYear?: number;
  status?: string;
}

interface AniListAnimeResponse {
  data: {
    Page: {
      pageInfo: {
        hasNextPage: boolean;
        total: number;
      };
      media: Anime[];
    };
  };
}

interface CacheEntry {
  data: Anime[];
  timestamp: number;
}

class AniListService {
  private client: AxiosInstance;
  private baseURL = import.meta.env.DEV ? "/api" : "https://graphql.anilist.co";
  private readonly CACHE_DURATION = 30 * 60 * 1000;
  private readonly STORAGE_PREFIX = "anilist_cache_";

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

  private getCachedData(key: string): Anime[] | null {
    try {
      const storageKey = this.STORAGE_PREFIX + key;
      const cached = localStorage.getItem(storageKey);
      if (!cached) return null;

      const entry: CacheEntry = JSON.parse(cached);
      if (this.isCacheValid(entry.timestamp)) {
        return entry.data;
      }
      localStorage.removeItem(storageKey);
      return null;
    } catch {
      return null;
    }
  }

  private setCacheData(key: string, data: Anime[]): void {
    try {
      const storageKey = this.STORAGE_PREFIX + key;
      const entry: CacheEntry = {
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
          media(type: ANIME${searchFilter}) {
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
      const cached = this.getCachedData(cacheKey);
      if (cached) return cached;

      const response = await this.client.post<AniListAnimeResponse>("", {
        query: this.getQueryString(page, perPage, query),
      });

      if (response.data.data.Page.media) {
        this.setCacheData(cacheKey, response.data.data.Page.media);
        return response.data.data.Page.media;
      }
      return [];
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getPopularAnime(page: number = 1, perPage: number = 5): Promise<Anime[]> {
    try {
      const cacheKey = this.generateCacheKey("popular", page, perPage);
      const cached = this.getCachedData(cacheKey);
      if (cached) return cached;

      const response = await this.client.post<AniListAnimeResponse>("", {
        query: `
          query {
            Page(page: ${page}, perPage: ${perPage}) {
              pageInfo {
                hasNextPage
                total
              }
              media(type: ANIME, sort: POPULARITY_DESC) {
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

      if (response.data.data.Page.media) {
        this.setCacheData(cacheKey, response.data.data.Page.media);
        return response.data.data.Page.media;
      }
      return [];
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getPopularThisSeason(page: number = 1, perPage: number = 6): Promise<Anime[]> {
    try {
      const cacheKey = this.generateCacheKey("popularSeason", page, perPage);
      const cached = this.getCachedData(cacheKey);
      if (cached) return cached;

      const response = await this.client.post<AniListAnimeResponse>("", {
        query: `
          query {
            Page(page: ${page}, perPage: ${perPage}) {
              pageInfo {
                hasNextPage
                total
              }
              media(type: ANIME, season: FALL, seasonYear: 2025, sort: POPULARITY_DESC) {
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

      if (response.data.data.Page.media) {
        this.setCacheData(cacheKey, response.data.data.Page.media);
        return response.data.data.Page.media;
      }
      return [];
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getTrendingAnime(page: number = 1, perPage: number = 6): Promise<Anime[]> {
    try {
      const cacheKey = this.generateCacheKey("trending", page, perPage);
      const cached = this.getCachedData(cacheKey);
      if (cached) return cached;

      const response = await this.client.post<AniListAnimeResponse>("", {
        query: `
          query {
            Page(page: ${page}, perPage: ${perPage}) {
              pageInfo {
                hasNextPage
                total
              }
              media(type: ANIME, sort: TRENDING_DESC) {
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

      if (response.data.data.Page.media) {
        this.setCacheData(cacheKey, response.data.data.Page.media);
        return response.data.data.Page.media;
      }
      return [];
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getUpcomingNextSeason(page: number = 1, perPage: number = 6): Promise<Anime[]> {
    try {
      const cacheKey = this.generateCacheKey("upcoming", page, perPage);
      const cached = this.getCachedData(cacheKey);
      if (cached) return cached;

      const response = await this.client.post<AniListAnimeResponse>("", {
        query: `
          query {
            Page(page: ${page}, perPage: ${perPage}) {
              pageInfo {
                hasNextPage
                total
              }
              media(type: ANIME, season: WINTER, seasonYear: 2026, sort: POPULARITY_DESC) {
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

      if (response.data.data.Page.media) {
        this.setCacheData(cacheKey, response.data.data.Page.media);
        return response.data.data.Page.media;
      }
      return [];
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getAllTimePopular(page: number = 1, perPage: number = 6): Promise<Anime[]> {
    try {
      const cacheKey = this.generateCacheKey("allPopular", page, perPage);
      const cached = this.getCachedData(cacheKey);
      if (cached) return cached;

      const response = await this.client.post<AniListAnimeResponse>("", {
        query: `
          query {
            Page(page: ${page}, perPage: ${perPage}) {
              pageInfo {
                hasNextPage
                total
              }
              media(type: ANIME, sort: POPULARITY_DESC) {
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

      if (response.data.data.Page.media) {
        this.setCacheData(cacheKey, response.data.data.Page.media);
        return response.data.data.Page.media;
      }
      return [];
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getRecommendedAnime(page: number = 1, perPage: number = 6): Promise<Anime[]> {
    try {
      const cacheKey = this.generateCacheKey("recommended", page, perPage);
      const cached = this.getCachedData(cacheKey);
      if (cached) return cached;

      const response = await this.client.post<AniListAnimeResponse>("", {
        query: `
          query {
            Page(page: ${page}, perPage: ${perPage}) {
              pageInfo {
                hasNextPage
                total
              }
              media(type: ANIME, sort: SCORE_DESC) {
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

      if (response.data.data.Page.media) {
        this.setCacheData(cacheKey, response.data.data.Page.media);
        return response.data.data.Page.media;
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
}

export const aniListService = new AniListService();
export type { Anime, AniListError, AniListAnimeResponse };
