import axios from "axios";
import type { AxiosInstance } from "axios";

interface AniListError {
  message: string;
  status?: number;
}

interface Manga {
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
  chapters?: number;
  volumes?: number;
  status?: string;
  type?: string;
  format?: string;
  genres?: string[];
  bannerImage?: string;
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
      node: Manga;
    }[];
  };
  recommendations?: {
    nodes: {
      mediaRecommendation: Manga;
    }[];
  };
}

interface AniListMangaResponse {
  data: {
    Page?: {
      pageInfo: {
        hasNextPage: boolean;
        total: number;
      };
      media: Manga[];
    };
    Media?: Manga;
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
  format?: string[];
  status?: string;
}

class AniListMangaService {
  private client: AxiosInstance;
  private baseURL = import.meta.env.DEV ? "/api" : "https://graphql.anilist.co";
  private readonly CACHE_DURATION = 30 * 60 * 1000;
  private readonly STORAGE_PREFIX = "anilist_manga_cache_v1_";

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
    } catch {}
  }

  async searchManga(query: string, page: number = 1, perPage: number = 10): Promise<Manga[]> {
    try {
      const cacheKey = this.generateCacheKey("search", page, perPage, query);
      const cached = this.getCachedData<Manga[]>(cacheKey);
      if (cached) return cached;

      const response = await this.client.post<AniListMangaResponse>("", {
        query: `
          query {
            Page(page: ${page}, perPage: ${perPage}) {
              pageInfo {
                hasNextPage
                total
              }
              media(type: MANGA, search: "${query}") {
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
                chapters
                volumes
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

  async getPopularManga(page: number = 1, perPage: number = 6): Promise<Manga[]> {
    try {
      const cacheKey = this.generateCacheKey("popular", page, perPage);
      const cached = this.getCachedData<Manga[]>(cacheKey);
      if (cached) return cached;

      const response = await this.client.post<AniListMangaResponse>("", {
        query: `
          query {
            Page(page: ${page}, perPage: ${perPage}) {
              pageInfo {
                hasNextPage
                total
              }
              media(type: MANGA, sort: POPULARITY_DESC) {
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
                chapters
                volumes
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

  async getTrendingManga(page: number = 1, perPage: number = 6): Promise<Manga[]> {
    try {
      const cacheKey = this.generateCacheKey("trending", page, perPage);
      const cached = this.getCachedData<Manga[]>(cacheKey);
      if (cached) return cached;

      const response = await this.client.post<AniListMangaResponse>("", {
        query: `
          query {
            Page(page: ${page}, perPage: ${perPage}) {
              pageInfo {
                hasNextPage
                total
              }
              media(type: MANGA, sort: TRENDING_DESC) {
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
                chapters
                volumes
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

  async getTopRatedManga(page: number = 1, perPage: number = 6): Promise<Manga[]> {
    try {
      const cacheKey = this.generateCacheKey("topRated", page, perPage);
      const cached = this.getCachedData<Manga[]>(cacheKey);
      if (cached) return cached;

      const response = await this.client.post<AniListMangaResponse>("", {
        query: `
          query {
            Page(page: ${page}, perPage: ${perPage}) {
              pageInfo {
                hasNextPage
                total
              }
              media(type: MANGA, sort: SCORE_DESC) {
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
                chapters
                volumes
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

  async searchAdvanced(
    filters: SearchFilters,
    page: number = 1,
    perPage: number = 15
  ): Promise<Manga[]> {
    try {
      const cacheKey = this.generateCacheKey(
        "advancedSearch",
        page,
        perPage,
        JSON.stringify(filters)
      );
      const cached = this.getCachedData<Manga[]>(cacheKey);
      if (cached) return cached;

      const queryParts = [];
      if (filters.search) queryParts.push(`search: "${filters.search}"`);
      if (filters.genre && filters.genre.length > 0) {
        const genres = filters.genre.map((g) => `"${g}"`).join(", ");
        queryParts.push(`genre_in: [${genres}]`);
      }
      if (filters.year)
        queryParts.push(
          `startDate_greater: ${filters.year}0101, startDate_lesser: ${filters.year}1231`
        );
      if (filters.format && filters.format.length > 0) {
        const formats = filters.format.map((f) => `"${f}"`).join(", ");
        queryParts.push(`format_in: [${formats}]`);
      }
      if (filters.status) queryParts.push(`status: ${filters.status}`);

      const filterString = queryParts.length > 0 ? `, ${queryParts.join(", ")}` : "";

      const response = await this.client.post<AniListMangaResponse>("", {
        query: `
          query {
            Page(page: ${page}, perPage: ${perPage}) {
              pageInfo {
                hasNextPage
                total
              }
              media(type: MANGA${filterString}, sort: POPULARITY_DESC) {
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
                chapters
                volumes
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

  async getMangaById(id: number): Promise<Manga> {
    try {
      const cacheKey = this.generateCacheKey("manga_detail", id, 1);
      const cached = this.getCachedData<Manga>(cacheKey);
      if (cached) return cached;

      const response = await this.client.post<AniListMangaResponse>("", {
        query: `
          query {
            Media(id: ${id}, type: MANGA) {
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
              chapters
              volumes
              status
              format
              genres
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
            }
          }
        `,
      });

      if (response.data.data.Media) {
        this.setCacheData(cacheKey, response.data.data.Media);
        return response.data.data.Media;
      }
      throw new Error("Manga not found");
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
    } catch {}
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

export const aniListMangaService = new AniListMangaService();
export type { Manga, AniListError, AniListMangaResponse, SearchFilters };
