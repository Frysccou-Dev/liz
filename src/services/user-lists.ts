import { supabase } from "@/utils/supabase";

export interface CustomList {
  id: number;
  name: string;
  description?: string;
  created_at: string;
}

export interface ListItem {
  id: number;
  list_id: number;
  media_id: number;
  media_type: "ANIME" | "MANGA";
  media_title: string;
  media_cover: string;
  added_at: string;
}

export interface MediaStatus {
  id: number;
  media_id: number;
  status: string;
  score?: number;
  updated_at: string;
  media_title?: string;
  media_cover?: string;
}

class UserListService {
  async getCustomLists() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("custom_lists")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data as CustomList[];
  }

  async createCustomList(name: string, description?: string) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("custom_lists")
      .insert({
        name,
        description,
        user_id: user.id,
      })
      .select()
      .single();
    if (error) throw error;
    if (!data) throw new Error("No data returned");
    return data as CustomList;
  }

  async deleteCustomList(id: number) {
    const { error } = await supabase.from("custom_lists").delete().eq("id", id);
    if (error) throw error;
  }

  async getListItems(listId: number) {
    const { data, error } = await supabase
      .from("list_items")
      .select("*")
      .eq("list_id", listId)
      .order("added_at", { ascending: false });
    if (error) throw error;
    return data as ListItem[];
  }

  async addToList(
    listId: number,
    media: { id: number; type: "ANIME" | "MANGA"; title: string; cover: string }
  ) {
    const { error } = await supabase.from("list_items").insert({
      list_id: listId,
      media_id: media.id,
      media_type: media.type,
      media_title: media.title,
      media_cover: media.cover,
    });
    if (error) throw error;
  }

  async removeFromList(listId: number, mediaId: number, mediaType: "ANIME" | "MANGA") {
    const { error } = await supabase
      .from("list_items")
      .delete()
      .match({ list_id: listId, media_id: mediaId, media_type: mediaType });
    if (error) throw error;
  }

  async updateStatus(
    mediaId: number,
    type: "ANIME" | "MANGA",
    status: string,
    score?: number,
    title?: string,
    cover?: string
  ) {
    const table = type === "ANIME" ? "user_anime_status" : "user_manga_status";
    const idField = type === "ANIME" ? "anime_id" : "manga_id";

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const payload: Record<string, string | number | undefined> = {
      user_id: user.id,
      [idField]: mediaId,
      status,
      score,
    };

    if (title) payload.media_title = title;
    if (cover) payload.media_cover = cover;

    const { error } = await supabase
      .from(table)
      .upsert(payload, { onConflict: `user_id,${idField}` });

    if (error) throw error;
  }

  async getUserMediaStatus(type: "ANIME" | "MANGA") {
    const table = type === "ANIME" ? "user_anime_status" : "user_manga_status";
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from(table)
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });

    if (error) throw error;
    return data as MediaStatus[];
  }

  async getStatus(mediaId: number, type: "ANIME" | "MANGA") {
    const table = type === "ANIME" ? "user_anime_status" : "user_manga_status";
    const idField = type === "ANIME" ? "anime_id" : "manga_id";

    const { data, error } = await supabase
      .from(table)
      .select("status, score")
      .eq(idField, mediaId)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data as { status: string; score: number } | null;
  }
}

export const userListService = new UserListService();
