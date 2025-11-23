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
  comments_count?: number;
}

export interface Profile {
  id: string;
  username: string;
  avatar_url: string;
  followers_count: number;
  following_count: number;
  is_following?: boolean;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  parent_comment_id?: string | null;
  replies_count?: number;
  profiles?: {
    username: string;
    avatar_url: string;
  };
}

export const socialService = {
  async getPosts(page = 0, limit = 10) {
    const { data: posts, error } = await supabase
      .from("posts")
      .select(
        `
        *,
        profiles!posts_user_id_fkey (username, avatar_url),
        post_votes (vote_type, user_id),
        post_comments!post_comments_post_id_fkey (id)
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

    interface PostComment {
      id: string;
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
      post_comments: PostComment[];
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
        comments_count: post.post_comments?.length || 0,
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

  async getProfile(userId: string) {
    const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single();

    if (error) throw error;

    const { data: session } = await supabase.auth.getSession();
    const currentUserId = session.session?.user?.id;

    if (currentUserId && currentUserId !== userId) {
      const { count } = await supabase
        .from("follows")
        .select("*", { count: "exact", head: true })
        .eq("follower_id", currentUserId)
        .eq("following_id", userId);

      return {
        ...data,
        is_following: count !== null && count > 0,
      };
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

  async getFollowers(userId: string) {
    const { data, error } = await supabase
      .from("follows")
      .select(
        `
        follower_id,
        profiles!follows_follower_id_fkey (
          id,
          username,
          avatar_url,
          followers_count,
          following_count
        )
      `
      )
      .eq("following_id", userId);

    if (error) throw error;

    const { data: user } = await supabase.auth.getUser();
    const currentUserId = user.user?.id;

    interface FollowResponse {
      follower_id: string;
      profiles: {
        id: string;
        username: string;
        avatar_url: string;
        followers_count: number;
        following_count: number;
      };
    }

    if (currentUserId) {
      const { data: follows } = await supabase
        .from("follows")
        .select("following_id")
        .eq("follower_id", currentUserId);

      const followingIds = new Set(follows?.map((f: { following_id: string }) => f.following_id));

      return (data as unknown as FollowResponse[]).map((item) => ({
        ...item.profiles,
        is_following: followingIds.has(item.profiles.id),
      }));
    }

    return (data as unknown as FollowResponse[]).map((item) => item.profiles);
  },

  async getFollowing(userId: string) {
    const { data, error } = await supabase
      .from("follows")
      .select(
        `
        following_id,
        profiles!follows_following_id_fkey (
          id,
          username,
          avatar_url,
          followers_count,
          following_count
        )
      `
      )
      .eq("follower_id", userId);

    if (error) throw error;

    const { data: user } = await supabase.auth.getUser();
    const currentUserId = user.user?.id;

    interface FollowingResponse {
      following_id: string;
      profiles: {
        id: string;
        username: string;
        avatar_url: string;
        followers_count: number;
        following_count: number;
      };
    }

    if (currentUserId) {
      const { data: follows } = await supabase
        .from("follows")
        .select("following_id")
        .eq("follower_id", currentUserId);

      const followingIds = new Set(follows?.map((f: { following_id: string }) => f.following_id));

      return (data as unknown as FollowingResponse[]).map((item) => ({
        ...item.profiles,
        is_following: followingIds.has(item.profiles.id),
      }));
    }

    return (data as unknown as FollowingResponse[]).map((item) => item.profiles);
  },

  async getUserPosts(userId: string, page = 0, limit = 10) {
    const { data: posts, error } = await supabase
      .from("posts")
      .select(
        `
        *,
        profiles!posts_user_id_fkey (username, avatar_url),
        post_votes (vote_type, user_id),
        post_comments!post_comments_post_id_fkey (id)
      `
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(page * limit, (page + 1) * limit - 1);

    if (error) {
      console.error("Error fetching user posts:", error);
      throw error;
    }

    const { data: user } = await supabase.auth.getUser();
    const currentUserId = user.user?.id;

    interface PostVote {
      vote_type: number;
      user_id: string;
    }

    interface PostComment {
      id: string;
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
      post_comments: PostComment[];
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
        comments_count: post.post_comments?.length || 0,
      };
    });
  },

  async getComments(postId: string, page = 0, limit = 5) {
    const { data, error } = await supabase
      .from("post_comments")
      .select(
        `
        *,
        profiles(username, avatar_url)
      `
      )
      .eq("post_id", postId)
      .is("parent_comment_id", null)
      .order("created_at", { ascending: false })
      .range(page * limit, (page + 1) * limit - 1);

    if (error) {
      console.error("Error fetching comments:", error);
      throw error;
    }

    interface CommentResponse {
      id: string;
      post_id: string;
      user_id: string;
      content: string;
      created_at: string;
      profiles: {
        username: string;
        avatar_url: string;
      } | null;
    }

    return (data as unknown as CommentResponse[]).map((comment) => ({
      ...comment,
      profiles: comment.profiles || undefined,
    }));
  },

  async createComment(postId: string, content: string, parentCommentId?: string) {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error("Not authenticated");

    console.log("Creating comment in Supabase:", {
      post_id: postId,
      user_id: user.user.id,
      content: content.substring(0, 50),
      parent_comment_id: parentCommentId || null,
    });

    const { data, error } = await supabase
      .from("post_comments")
      .insert({
        post_id: postId,
        user_id: user.user.id,
        content,
        parent_comment_id: parentCommentId || null,
      })
      .select(
        `
        *,
        profiles(username, avatar_url)
      `
      )
      .single();

    if (error) {
      console.error("Supabase error creating comment:", error);
      throw new Error(`Failed to create comment: ${error.message}`);
    }

    if (!data) {
      throw new Error("No data returned from comment creation");
    }

    if (parentCommentId) {
      await supabase.rpc("increment_replies_count", { comment_id: parentCommentId });
    }

    interface CommentResponse {
      id: string;
      post_id: string;
      user_id: string;
      content: string;
      created_at: string;
      parent_comment_id: string | null;
      replies_count: number;
      profiles: {
        username: string;
        avatar_url: string;
      } | null;
    }

    const commentData = data as unknown as CommentResponse;
    return {
      ...commentData,
      profiles: commentData.profiles || undefined,
    };
  },

  async getReplies(commentId: string) {
    const { data, error } = await supabase
      .from("post_comments")
      .select(
        `
        *,
        profiles(username, avatar_url)
      `
      )
      .eq("parent_comment_id", commentId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching replies:", error);
      throw error;
    }

    interface CommentResponse {
      id: string;
      post_id: string;
      user_id: string;
      content: string;
      created_at: string;
      parent_comment_id: string | null;
      replies_count: number;
      profiles: {
        username: string;
        avatar_url: string;
      } | null;
    }

    return (data as unknown as CommentResponse[]).map((comment) => ({
      ...comment,
      profiles: comment.profiles || undefined,
    }));
  },

  async deleteComment(commentId: string) {
    const { error } = await supabase.from("post_comments").delete().eq("id", commentId);

    if (error) throw error;
  },

  async getCommentsCount(postId: string) {
    const { count, error } = await supabase
      .from("post_comments")
      .select("*", { count: "exact", head: true })
      .eq("post_id", postId);

    if (error) throw error;
    return count || 0;
  },
};
