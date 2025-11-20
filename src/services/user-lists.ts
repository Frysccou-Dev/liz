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
}

class UserListService {
  async getCustomLists() {
    const { data, error } = await supabase
      .from("custom_lists")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data as CustomList[];
  }

  async createCustomList(name: string, description?: string) {
    const { data, error } = await supabase
      .from("custom_lists")
      .insert({ name, description })
      .select()
      .single();
    if (error) throw error;
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

  async updateStatus(mediaId: number, type: "ANIME" | "MANGA", status: string, score?: number) {
    const table = type === "ANIME" ? "user_anime_status" : "user_manga_status";
    const idField = type === "ANIME" ? "anime_id" : "manga_id";

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { error } = await supabase.from(table).upsert(
      {
        user_id: user.id,
        [idField]: mediaId,
        status,
        score,
      },
      { onConflict: `user_id,${idField}` }
    );

    if (error) throw error;
  }

  async getStatus(mediaId: number, type: "ANIME" | "MANGA") {
    const table = type === "ANIME" ? "user_anime_status" : "user_manga_status";
    const idField = type === "ANIME" ? "anime_id" : "manga_id";

    const { data, error } = await supabase
      .from(table)
      .select("status, score")
      .eq(idField, mediaId)
      .single();

    if (error && error.code !== "PGRST116") throw error; // Ignore not found error
    return data as { status: string; score: number } | null;
  }
}

export const userListService = new UserListService();
