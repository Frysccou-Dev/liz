import { BaseAniListService, type AniListError } from "./base-anilist";

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

interface SearchFilters {
  search?: string;
  genre?: string[];
  year?: number;
  season?: string;
  format?: string[];
  status?: string;
}

class AniListService extends BaseAniListService {
  protected readonly STORAGE_PREFIX = "anilist_cache_v4_";

  async searchAnime(query: string, page: number = 1, perPage: number = 10): Promise<Anime[]> {
    try {
      const cacheKey = this.generateCacheKey("search", page, perPage, query);
      const cached = this.getCachedData<Anime[]>(cacheKey);
      if (cached) return cached;

      const response = await this.client.post<AniListAnimeResponse>("", {
        query: `
          query ($page: Int!, $perPage: Int!, $search: String!) {
            Page(page: $page, perPage: $perPage) {
              pageInfo {
                hasNextPage
                total
              }
              media(type: ANIME, isAdult: false, search: $search) {
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

  async getPopularAnime(page: number = 1, perPage: number = 5): Promise<Anime[]> {
    try {
      const cacheKey = this.generateCacheKey("popular", page, perPage);
      const cached = this.getCachedData<Anime[]>(cacheKey);
      if (cached) return cached;

      const response = await this.client.post<AniListAnimeResponse>("", {
        query: `
          query ($page: Int!, $perPage: Int!) {
            Page(page: $page, perPage: $perPage) {
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

  async getPopularThisSeason(page: number = 1, perPage: number = 6): Promise<Anime[]> {
    try {
      const { season, year } = BaseAniListService.getCurrentSeason();
      const cacheKey = this.generateCacheKey("popularSeason", page, perPage, `${season}_${year}`);
      const cached = this.getCachedData<Anime[]>(cacheKey);
      if (cached) return cached;

      const response = await this.client.post<AniListAnimeResponse>("", {
        query: `
          query ($page: Int!, $perPage: Int!, $season: MediaSeason!, $seasonYear: Int!) {
            Page(page: $page, perPage: $perPage) {
              pageInfo {
                hasNextPage
                total
              }
              media(type: ANIME, isAdult: false, season: $season, seasonYear: $seasonYear, sort: POPULARITY_DESC) {
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
        variables: { page, perPage, season, seasonYear: year },
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
          query ($page: Int!, $perPage: Int!) {
            Page(page: $page, perPage: $perPage) {
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

  async getUpcomingNextSeason(page: number = 1, perPage: number = 6): Promise<Anime[]> {
    try {
      const { season, year } = BaseAniListService.getNextSeason();
      const cacheKey = this.generateCacheKey("upcoming", page, perPage, `${season}_${year}`);
      const cached = this.getCachedData<Anime[]>(cacheKey);
      if (cached) return cached;

      const response = await this.client.post<AniListAnimeResponse>("", {
        query: `
          query ($page: Int!, $perPage: Int!, $season: MediaSeason!, $seasonYear: Int!) {
            Page(page: $page, perPage: $perPage) {
              pageInfo {
                hasNextPage
                total
              }
              media(type: ANIME, isAdult: false, season: $season, seasonYear: $seasonYear, sort: POPULARITY_DESC) {
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
        variables: { page, perPage, season, seasonYear: year },
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
          query ($page: Int!, $perPage: Int!) {
            Page(page: $page, perPage: $perPage) {
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

  async getRecommendedAnime(page: number = 1, perPage: number = 6): Promise<Anime[]> {
    try {
      const cacheKey = this.generateCacheKey("recommended", page, perPage);
      const cached = this.getCachedData<Anime[]>(cacheKey);
      if (cached) return cached;

      const response = await this.client.post<AniListAnimeResponse>("", {
        query: `
          query ($page: Int!, $perPage: Int!) {
            Page(page: $page, perPage: $perPage) {
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
  ): Promise<Anime[]> {
    try {
      const cacheKey = this.generateCacheKey(
        "advancedSearch",
        page,
        perPage,
        JSON.stringify(filters),
      );
      const cached = this.getCachedData<Anime[]>(cacheKey);
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
      } else {
        conditions.push('genre_not_in: ["Hentai"]');
      }

      if (filters.year) {
        variableDefs.push("$seasonYear: Int");
        conditions.push("seasonYear: $seasonYear");
        variables.seasonYear = filters.year;
      }

      if (filters.season) {
        variableDefs.push("$season: MediaSeason");
        conditions.push("season: $season");
        variables.season = filters.season;
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

      const response = await this.client.post<AniListAnimeResponse>("", {
        query: `
          query (${variableDefs.join(", ")}) {
            Page(page: $page, perPage: $perPage) {
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

  async getAnimeById(id: number): Promise<Anime> {
    try {
      const cacheKey = this.generateCacheKey("anime_detail", id, 1);
      const cached = this.getCachedData<Anime>(cacheKey);
      if (cached) return cached;

      const response = await this.client.post<AniListAnimeResponse>("", {
        query: `
          query ($id: Int!) {
            Media(id: $id, type: ANIME) {
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
        variables: { id },
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
