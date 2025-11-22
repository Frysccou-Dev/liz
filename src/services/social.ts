import { supabase } from "@/utils/supabase";

export interface Post {
  id: string;
  user_id: string;
  title: string;
  content: string;
  images: string[];
  created_at: string;
  profiles?: {
    username: string;
    avatar_url: string;
  };
  vote_count?: number;
  user_vote?: number;
}

export interface Profile {
  id: string;
  username: string;
  avatar_url: string;
  followers_count: number;
  following_count: number;
  is_following?: boolean;
}

export const socialService = {
  async getPosts(page = 0, limit = 10) {
    const { data: posts, error } = await supabase
      .from("posts")
      .select(
        `
        *,
        profiles!posts_user_id_fkey (username, avatar_url),
        post_votes (vote_type, user_id)
      `
      )
      .order("created_at", { ascending: false })
      .range(page * limit, (page + 1) * limit - 1);

    if (error) {
      console.error("Error fetching posts:", error);
      throw error;
    }

    const { data: user } = await supabase.auth.getUser();
    const currentUserId = user.user?.id;

    interface PostVote {
      vote_type: number;
      user_id: string;
    }

    interface PostResponse {
      id: string;
      user_id: string;
      title: string;
      content: string;
      images: string[];
      created_at: string;
      profiles: {
        username: string;
        avatar_url: string;
      } | null;
      post_votes: PostVote[];
    }

    return (posts as unknown as PostResponse[]).map((post) => {
      const votes = post.post_votes || [];
      const upvotes = votes.filter((v) => v.vote_type === 1).length;
      const downvotes = votes.filter((v) => v.vote_type === -1).length;
      const userVote = currentUserId
        ? votes.find((v) => v.user_id === currentUserId)?.vote_type || 0
        : 0;

      return {
        ...post,
        profiles: post.profiles || undefined,
        vote_count: upvotes - downvotes,
        user_vote: userVote,
      };
    });
  },

  async createPost(title: string, content: string, images: string[]) {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("posts")
      .insert({
        user_id: user.user.id,
        title,
        content,
        images,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async votePost(postId: string, voteType: 1 | -1) {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error("Not authenticated");

    const { data: existingVote } = await supabase
      .from("post_votes")
      .select("*")
      .eq("post_id", postId)
      .eq("user_id", user.user.id)
      .single();

    if (existingVote) {
      if (existingVote.vote_type === voteType) {
        const { error } = await supabase.from("post_votes").delete().eq("id", existingVote.id);
        if (error) throw error;
        return 0;
      } else {
        const { error } = await supabase
          .from("post_votes")
          .update({ vote_type: voteType })
          .eq("id", existingVote.id);
        if (error) throw error;
        return voteType;
      }
    } else {
      const { error } = await supabase.from("post_votes").insert({
        post_id: postId,
        user_id: user.user.id,
        vote_type: voteType,
      });
      if (error) throw error;
      return voteType;
    }
  },

  async searchProfiles(query: string) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .ilike("username", `%${query}%`)
      .limit(10);

    if (error) throw error;

    const { data: user } = await supabase.auth.getUser();
    const currentUserId = user.user?.id;

    if (currentUserId) {
      const { data: follows } = await supabase
        .from("follows")
        .select("following_id")
        .eq("follower_id", currentUserId);

      const followingIds = new Set(follows?.map((f: { following_id: string }) => f.following_id));

      return data.map((profile: Profile) => ({
        ...profile,
        is_following: followingIds.has(profile.id),
      }));
    }

    return data;
  },

  async followUser(targetUserId: string) {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error("Not authenticated");

    const { error } = await supabase.from("follows").insert({
      follower_id: user.user.id,
      following_id: targetUserId,
    });

    if (error) throw error;
  },

  async unfollowUser(targetUserId: string) {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error("Not authenticated");

    const { error } = await supabase
      .from("follows")
      .delete()
      .eq("follower_id", user.user.id)
      .eq("following_id", targetUserId);

    if (error) throw error;
  },
};
