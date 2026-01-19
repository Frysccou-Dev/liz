import axios from "axios";
import type { AxiosInstance } from "axios";

export interface AniListError {
  message: string;
  status?: number;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

type MediaType = "ANIME" | "MANGA";

interface SeasonInfo {
  season: "WINTER" | "SPRING" | "SUMMER" | "FALL";
  year: number;
}

export abstract class BaseAniListService {
  protected client: AxiosInstance;
  protected abstract readonly STORAGE_PREFIX: string;
  protected readonly CACHE_DURATION = 30 * 60 * 1000;

  constructor() {
    const baseURL = import.meta.env.DEV ? "/api" : "https://graphql.anilist.co";
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  protected generateCacheKey(
    method: string,
    page: number,
    perPage: number,
    extra?: string,
  ): string {
    return `${method}:${page}:${perPage}${extra ? `:${extra}` : ""}`;
  }

  protected isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.CACHE_DURATION;
  }

  protected getCachedData<T>(key: string): T | null {
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
      try {
        localStorage.removeItem(this.STORAGE_PREFIX + key);
      } catch {}
      return null;
    }
  }

  protected setCacheData<T>(key: string, data: T): void {
    try {
      const storageKey = this.STORAGE_PREFIX + key;
      const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
      };
      localStorage.setItem(storageKey, JSON.stringify(entry));
    } catch {}
  }

  protected handleError(error: unknown): AniListError {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const message = error.response?.data?.errors?.[0]?.message || error.message;
      return { message, status };
    }
    return { message: "An unknown error occurred" };
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

  static getCurrentSeason(): SeasonInfo {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    let season: "WINTER" | "SPRING" | "SUMMER" | "FALL";
    if (month >= 1 && month <= 3) {
      season = "WINTER";
    } else if (month >= 4 && month <= 6) {
      season = "SPRING";
    } else if (month >= 7 && month <= 9) {
      season = "SUMMER";
    } else {
      season = "FALL";
    }

    return { season, year };
  }

  static getNextSeason(): SeasonInfo {
    const current = BaseAniListService.getCurrentSeason();
    const seasons: Array<"WINTER" | "SPRING" | "SUMMER" | "FALL"> = [
      "WINTER",
      "SPRING",
      "SUMMER",
      "FALL",
    ];
    const currentIndex = seasons.indexOf(current.season);
    const nextIndex = (currentIndex + 1) % 4;
    const nextYear = nextIndex === 0 ? current.year + 1 : current.year;

    return { season: seasons[nextIndex], year: nextYear };
  }

  protected buildMediaQuery(
    type: MediaType,
    options: {
      page: number;
      perPage: number;
      sort?: string;
      season?: string;
      seasonYear?: number;
      additionalFilters?: string;
      includeExtraLarge?: boolean;
    },
  ): string {
    const {
      page,
      perPage,
      sort = "POPULARITY_DESC",
      season,
      seasonYear,
      additionalFilters = "",
      includeExtraLarge = false,
    } = options;

    const seasonFilter = season ? `, season: ${season}` : "";
    const yearFilter = seasonYear ? `, seasonYear: ${seasonYear}` : "";
    const extraLarge = includeExtraLarge ? "extraLarge" : "";

    return `
      query ($page: Int!, $perPage: Int!) {
        Page(page: $page, perPage: $perPage) {
          pageInfo {
            hasNextPage
            total
          }
          media(type: ${type}, isAdult: false, sort: ${sort}${seasonFilter}${yearFilter}${additionalFilters}) {
            id
            title {
              romaji
              english
              native
            }
            coverImage {
              ${extraLarge}
              large
              medium
            }
            description
            averageScore
            popularity
            ${type === "ANIME" ? "episodes" : "chapters\n            volumes"}
            ${type === "ANIME" ? "season\n            seasonYear" : ""}
            status
          }
        }
      }
    `;
  }

  protected buildDetailQuery(type: MediaType, includeNextAiring: boolean = false): string {
    return `
      query ($id: Int!) {
        Media(id: $id, type: ${type}) {
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
          ${type === "ANIME" ? "episodes\n          duration\n          season\n          seasonYear" : "chapters\n          volumes"}
          status
          format
          genres
          ${
            type === "ANIME"
              ? `studios {
            nodes {
              name
            }
          }`
              : ""
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
          ${
            includeNextAiring
              ? `nextAiringEpisode {
            airingAt
            timeUntilAiring
            episode
          }`
              : ""
          }
        }
      }
    `;
  }
}
