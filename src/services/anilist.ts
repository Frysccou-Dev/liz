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

class AniListService {
  private client: AxiosInstance;
  private baseURL = "https://graphql.anilist.co";

  constructor() {
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
    });
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
      const response = await this.client.post<AniListAnimeResponse>("", {
        query: this.getQueryString(page, perPage, query),
      });

      if (response.data.data.Page.media) {
        return response.data.data.Page.media;
      }
      return [];
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getPopularAnime(page: number = 1, perPage: number = 10): Promise<Anime[]> {
    try {
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
        return response.data.data.Page.media;
      }
      return [];
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getTrendingAnime(page: number = 1, perPage: number = 10): Promise<Anime[]> {
    try {
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
        return response.data.data.Page.media;
      }
      return [];
    } catch (error) {
      throw this.handleError(error);
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
