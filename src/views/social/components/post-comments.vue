<template>
  <div class="border-t border-gray-100 mt-4 pt-4">
    <div class="flex items-center gap-2 mb-4">
      <MessageCircleIcon class="w-5 h-5 text-gray-500" />
      <h3 class="font-bold text-gray-900">Comments</h3>
      <span class="text-sm text-gray-500">({{ totalComments }})</span>
    </div>

    <div class="mb-4">
      <div class="flex gap-3">
        <div
          class="w-8 h-8 rounded-full bg-linear-to-br from-blue-400 to-purple-400 overflow-hidden shrink-0"
        >
          <img
            v-if="currentUserAvatar"
            :src="currentUserAvatar"
            class="w-full h-full object-cover"
          />
          <div
            v-else
            class="w-full h-full flex items-center justify-center text-white font-bold text-sm"
          >
            {{ currentUsername?.charAt(0).toUpperCase() }}
          </div>
        </div>
        <div class="flex-1">
          <textarea
            v-model="newComment"
            placeholder="Write a comment..."
            class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-900 resize-none"
            rows="2"
            @keydown.enter.ctrl="submitComment"
          ></textarea>
          <div class="flex justify-end mt-2">
            <button
              @click="submitComment"
              :disabled="!newComment.trim() || submitting"
              class="px-4 py-1.5 bg-gray-900 text-white text-sm rounded-full hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {{ submitting ? "Posting..." : "Comment" }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="loading && comments.length === 0" class="py-8 text-center">
      <div
        class="animate-spin w-6 h-6 border-4 border-gray-200 border-t-gray-900 rounded-full mx-auto"
      ></div>
    </div>

    <div v-else-if="comments.length === 0" class="py-8 text-center text-gray-400 text-sm">
      No comments yet. Be the first to comment!
    </div>

    <div v-else class="space-y-4">
      <div v-for="comment in comments" :key="comment.id" class="space-y-2">
        <div class="flex gap-3 group">
          <div
            class="w-8 h-8 rounded-full bg-linear-to-br from-purple-400 to-pink-400 overflow-hidden shrink-0"
          >
            <img
              v-if="comment.profiles?.avatar_url"
              :src="comment.profiles.avatar_url"
              class="w-full h-full object-cover"
            />
            <div
              v-else
              class="w-full h-full flex items-center justify-center text-white font-bold text-sm"
            >
              {{ comment.profiles?.username?.charAt(0).toUpperCase() }}
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <div class="bg-gray-50 rounded-2xl px-4 py-2">
              <div class="flex items-center gap-2 mb-1">
                <span class="font-bold text-sm text-gray-900">{{
                  comment.profiles?.username
                }}</span>
                <span class="text-xs text-gray-400">{{ formatDate(comment.created_at) }}</span>
              </div>
              <p class="text-sm text-gray-700 whitespace-pre-wrap wrap-break-word">
                {{ comment.content }}
              </p>
            </div>
            <div class="flex items-center gap-3 mt-1 ml-4">
              <button
                @click="toggleReply(comment.id)"
                class="text-xs text-gray-500 hover:text-blue-600 transition-colors font-medium"
              >
                Reply
              </button>
              <button
                v-if="comment.user_id === currentUserId"
                @click="deleteComment(comment.id)"
                class="text-xs text-red-500 hover:text-red-700 transition-colors"
              >
                Delete
              </button>
              <button
                v-if="comment.replies_count && comment.replies_count > 0"
                @click="toggleReplies(comment.id)"
                class="text-xs text-blue-600 hover:text-blue-800 transition-colors font-medium"
              >
                {{ showingReplies[comment.id] ? "Hide" : "View" }} {{ comment.replies_count }}
                {{ comment.replies_count === 1 ? "reply" : "replies" }}
              </button>
            </div>

            <div v-if="replyingTo === comment.id" class="mt-3 ml-4">
              <div class="flex gap-2">
                <textarea
                  v-model="replyContent"
                  placeholder="Write a reply..."
                  class="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-900 resize-none"
                  rows="2"
                  @keydown.enter.ctrl="submitReply(comment.id)"
                ></textarea>
              </div>
              <div class="flex justify-end gap-2 mt-2">
                <button
                  @click="cancelReply"
                  class="px-3 py-1 text-xs text-gray-600 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  @click="submitReply(comment.id)"
                  :disabled="!replyContent.trim() || submitting"
                  class="px-4 py-1 bg-gray-900 text-white text-xs rounded-full hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ submitting ? "Posting..." : "Reply" }}
                </button>
              </div>
            </div>

            <div
              v-if="showingReplies[comment.id] && replies[comment.id]"
              class="mt-3 ml-4 space-y-3 border-l-2 border-gray-200 pl-4"
            >
              <div
                v-for="reply in replies[comment.id]"
                :key="reply.id"
                class="flex gap-2 group/reply"
              >
                <div
                  class="w-6 h-6 rounded-full bg-linear-to-br from-blue-400 to-cyan-400 overflow-hidden shrink-0"
                >
                  <img
                    v-if="reply.profiles?.avatar_url"
                    :src="reply.profiles.avatar_url"
                    class="w-full h-full object-cover"
                  />
                  <div
                    v-else
                    class="w-full h-full flex items-center justify-center text-white font-bold text-xs"
                  >
                    {{ reply.profiles?.username?.charAt(0).toUpperCase() }}
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="bg-gray-100 rounded-xl px-3 py-1.5">
                    <div class="flex items-center gap-2 mb-0.5">
                      <span class="font-bold text-xs text-gray-900">{{
                        reply.profiles?.username
                      }}</span>
                      <span class="text-xs text-gray-400">{{ formatDate(reply.created_at) }}</span>
                    </div>
                    <p class="text-xs text-gray-700 whitespace-pre-wrap warp-break-word">
                      {{ reply.content }}
                    </p>
                  </div>
                  <button
                    v-if="reply.user_id === currentUserId"
                    @click="deleteComment(reply.id, comment.id)"
                    class="text-xs text-red-500 hover:text-red-700 mt-1 ml-3 opacity-0 group-hover/reply:opacity-100 transition-opacity"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="hasMore" class="pt-2">
        <button
          @click="loadMore"
          :disabled="loading"
          class="w-full py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50"
        >
          {{ loading ? "Loading..." : "Load more comments" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { MessageCircle as MessageCircleIcon } from "lucide-vue-next";
import { socialService, type Comment } from "@/services/social";

const props = defineProps<{
  postId: string;
  currentUserId?: string;
  currentUsername?: string;
  currentUserAvatar?: string;
}>();

const emit = defineEmits<{
  (e: "update-count", count: number): void;
}>();

const comments = ref<Comment[]>([]);
const loading = ref(false);
const submitting = ref(false);
const newComment = ref("");
const page = ref(0);
const hasMore = ref(true);
const totalComments = ref(0);

const replyingTo = ref<string | null>(null);
const replyContent = ref("");
const replies = ref<Record<string, Comment[]>>({});
const showingReplies = ref<Record<string, boolean>>({});

const fetchComments = async (reset = false) => {
  if (loading.value) return;

  loading.value = true;
  if (reset) {
    page.value = 0;
    comments.value = [];
    hasMore.value = true;
  }

  try {
    const newComments = await socialService.getComments(props.postId, page.value);
    if (newComments.length < 5) {
      hasMore.value = false;
    }
    comments.value.push(...newComments);
    page.value++;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const fetchCommentsCount = async () => {
  try {
    totalComments.value = await socialService.getCommentsCount(props.postId);
    emit("update-count", totalComments.value);
  } catch (error) {
    console.error(error);
  }
};

const submitComment = async () => {
  if (!newComment.value.trim() || submitting.value) return;

  submitting.value = true;
  try {
    console.log("Submitting comment:", {
      postId: props.postId,
      content: newComment.value,
      userId: props.currentUserId,
    });

    const comment = await socialService.createComment(props.postId, newComment.value);

    console.log("Comment created successfully:", comment);

    comments.value.unshift(comment);
    newComment.value = "";
    totalComments.value++;
    emit("update-count", totalComments.value);
  } catch (error) {
    console.error("Error creating comment:", error);

    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
      alert(`Failed to post comment: ${error.message}`);
    } else {
      console.error("Unknown error:", error);
      alert("Failed to post comment. Check console for details.");
    }
  } finally {
    submitting.value = false;
  }
};

const toggleReply = (commentId: string) => {
  if (replyingTo.value === commentId) {
    replyingTo.value = null;
    replyContent.value = "";
  } else {
    replyingTo.value = commentId;
    replyContent.value = "";
  }
};

const cancelReply = () => {
  replyingTo.value = null;
  replyContent.value = "";
};

const submitReply = async (parentCommentId: string) => {
  if (!replyContent.value.trim() || submitting.value) return;

  submitting.value = true;
  try {
    const reply = await socialService.createComment(
      props.postId,
      replyContent.value,
      parentCommentId
    );

    if (!replies.value[parentCommentId]) {
      replies.value[parentCommentId] = [];
    }
    replies.value[parentCommentId].push(reply);

    const parentComment = comments.value.find((c) => c.id === parentCommentId);
    if (parentComment) {
      parentComment.replies_count = (parentComment.replies_count || 0) + 1;
    }

    replyContent.value = "";
    replyingTo.value = null;
  } catch (error) {
    console.error("Error creating reply:", error);
    if (error instanceof Error) {
      alert(`Failed to post reply: ${error.message}`);
    }
  } finally {
    submitting.value = false;
  }
};

const toggleReplies = async (commentId: string) => {
  if (showingReplies.value[commentId]) {
    showingReplies.value[commentId] = false;
  } else {
    if (!replies.value[commentId]) {
      try {
        replies.value[commentId] = await socialService.getReplies(commentId);
      } catch (error) {
        console.error("Error fetching replies:", error);
        return;
      }
    }
    showingReplies.value[commentId] = true;
  }
};

const deleteComment = async (commentId: string, parentCommentId?: string) => {
  if (!confirm("Delete this comment?")) return;

  try {
    await socialService.deleteComment(commentId);

    if (parentCommentId) {
      if (replies.value[parentCommentId]) {
        replies.value[parentCommentId] = replies.value[parentCommentId].filter(
          (r) => r.id !== commentId
        );
      }
      const parentComment = comments.value.find((c) => c.id === parentCommentId);
      if (parentComment && parentComment.replies_count) {
        parentComment.replies_count--;
      }
    } else {
      comments.value = comments.value.filter((c) => c.id !== commentId);
      totalComments.value--;
      emit("update-count", totalComments.value);
    }
  } catch (error) {
    console.error(error);
  }
};

const loadMore = () => {
  fetchComments();
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 7) {
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  } else if (days > 0) {
    return `${days}d ago`;
  } else if (hours > 0) {
    return `${hours}h ago`;
  } else if (minutes > 0) {
    return `${minutes}m ago`;
  } else {
    return "just now";
  }
};

onMounted(() => {
  fetchComments(true);
  fetchCommentsCount();
});
</script>
