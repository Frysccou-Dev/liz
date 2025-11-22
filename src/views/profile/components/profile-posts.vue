<template>
  <div class="space-y-4">
    <div v-if="loading && posts.length === 0" class="p-8 text-center text-gray-400">
      <div
        class="animate-spin w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full mx-auto"
      ></div>
    </div>

    <div v-else-if="posts.length === 0" class="p-8 text-center text-gray-400">
      <div class="mb-4">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
          <MessageSquareIcon class="w-8 h-8 text-gray-300" />
        </div>
      </div>
      <p class="text-lg font-medium">No posts yet</p>
      <p class="text-sm mt-1">This user hasn't shared anything</p>
    </div>

    <div v-else class="space-y-4">
      <PostCard
        v-for="post in posts"
        :key="post.id"
        :post="post"
        @update:post="updatePost"
        @click="$emit('open-post', post)"
        @show-comments="$emit('open-post', post)"
      />

      <div v-if="loading" class="p-4 text-center text-gray-400">
        <div
          class="animate-spin w-6 h-6 border-4 border-gray-200 border-t-gray-900 rounded-full mx-auto"
        ></div>
      </div>

      <div v-if="!hasMore && posts.length > 0" class="p-4 text-center text-gray-400 text-sm">
        No more posts to load
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MessageSquare as MessageSquareIcon } from "lucide-vue-next";
import type { Post } from "@/services/social";
import PostCard from "@/views/social/components/post-card.vue";

defineProps<{
  posts: Post[];
  loading: boolean;
  hasMore: boolean;
}>();

const emit = defineEmits<{
  (e: "update:post", post: Post): void;
  (e: "open-post", post: Post): void;
}>();

const updatePost = (post: Post) => {
  emit("update:post", post);
};
</script>
