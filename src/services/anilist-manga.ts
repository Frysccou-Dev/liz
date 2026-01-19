import { BaseAniListService, type AniListError } from "./base-anilist";

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

interface SearchFilters {
  search?: string;
  genre?: string[];
  year?: number;
  format?: string[];
  status?: string;
}

class AniListMangaService extends BaseAniListService {
  protected readonly STORAGE_PREFIX = "anilist_manga_cache_v2_";

  async searchManga(query: string, page: number = 1, perPage: number = 10): Promise<Manga[]> {
    try {
      const cacheKey = this.generateCacheKey("search", page, perPage, query);
      const cached = this.getCachedData<Manga[]>(cacheKey);
      if (cached) return cached;

      const response = await this.client.post<AniListMangaResponse>("", {
        query: `
          query ($page: Int!, $perPage: Int!, $search: String!) {
            Page(page: $page, perPage: $perPage) {
              pageInfo {
                hasNextPage
                total
              }
              media(type: MANGA, search: $search) {
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
        variables: { page, perPage, search: query },
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
          query ($page: Int!, $perPage: Int!) {
            Page(page: $page, perPage: $perPage) {
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
        variables: { page, perPage },
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
          query ($page: Int!, $perPage: Int!) {
            Page(page: $page, perPage: $perPage) {
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
        variables: { page, perPage },
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
          query ($page: Int!, $perPage: Int!) {
            Page(page: $page, perPage: $perPage) {
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
        variables: { page, perPage },
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
    perPage: number = 15,
  ): Promise<Manga[]> {
    try {
      const cacheKey = this.generateCacheKey(
        "advancedSearch",
        page,
        perPage,
        JSON.stringify(filters),
      );
      const cached = this.getCachedData<Manga[]>(cacheKey);
      if (cached) return cached;

      const variables: Record<string, unknown> = { page, perPage };
      const conditions: string[] = [];
      const variableDefs: string[] = ["$page: Int!", "$perPage: Int!"];

      if (filters.search) {
        variableDefs.push("$search: String");
        conditions.push("search: $search");
        variables.search = filters.search;
      }

      if (filters.genre && filters.genre.length > 0) {
        variableDefs.push("$genres: [String]");
        conditions.push("genre_in: $genres");
        variables.genres = filters.genre;
      }

      if (filters.year) {
        variableDefs.push("$startDateGreater: FuzzyDateInt");
        variableDefs.push("$startDateLesser: FuzzyDateInt");
        conditions.push("startDate_greater: $startDateGreater");
        conditions.push("startDate_lesser: $startDateLesser");
        variables.startDateGreater = filters.year * 10000 + 101;
        variables.startDateLesser = filters.year * 10000 + 1231;
      }

      if (filters.format && filters.format.length > 0) {
        variableDefs.push("$formats: [MediaFormat]");
        conditions.push("format_in: $formats");
        variables.formats = filters.format;
      }

      if (filters.status) {
        variableDefs.push("$status: MediaStatus");
        conditions.push("status: $status");
        variables.status = filters.status;
      }

      const filterString = conditions.length > 0 ? `, ${conditions.join(", ")}` : "";

      const response = await this.client.post<AniListMangaResponse>("", {
        query: `
          query (${variableDefs.join(", ")}) {
            Page(page: $page, perPage: $perPage) {
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
        variables,
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
          query ($id: Int!) {
            Media(id: $id, type: MANGA) {
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
        variables: { id },
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
}

export const aniListMangaService = new AniListMangaService();
export type { Manga, AniListError, AniListMangaResponse, SearchFilters };
