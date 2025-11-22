<template>
  <div class="border border-gray-100 rounded-xl p-4 hover:shadow-sm transition-shadow">
    <div class="flex gap-3">
      <div class="shrink-0">
        <div class="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
          <img
            v-if="post.profiles?.avatar_url"
            :src="post.profiles.avatar_url"
            class="w-full h-full object-cover"
          />
          <div
            v-else
            class="w-full h-full flex items-center justify-center text-gray-500 font-medium"
          >
            {{ post.profiles?.username?.charAt(0).toUpperCase() }}
          </div>
        </div>
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-1">
          <span class="font-bold text-gray-900 text-sm">{{ post.profiles?.username }}</span>
          <span class="text-gray-400 text-xs">• {{ formatDate(post.created_at) }}</span>
        </div>

        <h3 class="font-bold text-gray-900 mb-1 text-base">{{ post.title }}</h3>
        <p class="text-gray-700 text-sm whitespace-pre-wrap mb-3">{{ post.content }}</p>

        <div v-if="post.images?.length" class="grid gap-2 mb-3" :class="gridClass">
          <div
            v-for="(img, idx) in post.images"
            :key="idx"
            class="relative aspect-video rounded-lg overflow-hidden cursor-pointer group"
            @click.stop="openImage(img)"
          >
            <img
              :src="img"
              class="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
          </div>
        </div>

        <div class="flex items-center gap-4 text-gray-500">
          <button
            @click.stop="handleVote(1)"
            class="flex items-center gap-1.5 text-sm hover:text-green-600 transition-colors"
            :class="{ 'text-green-600 font-medium': post.user_vote === 1 }"
          >
            <ArrowBigUpIcon class="w-5 h-5" />
            <span>{{ post.vote_count }}</span>
          </button>
          <button
            @click.stop="handleVote(-1)"
            class="flex items-center gap-1.5 text-sm hover:text-red-600 transition-colors"
            :class="{ 'text-red-600 font-medium': post.user_vote === -1 }"
          >
            <ArrowBigDownIcon class="w-5 h-5" />
          </button>
          <button
            @click.stop="$emit('show-comments')"
            class="flex items-center gap-1.5 text-sm hover:text-blue-600 transition-colors"
          >
            <MessageCircleIcon class="w-5 h-5" />
            <span v-if="post.comments_count">{{ post.comments_count }}</span>
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="selectedImage"
      class="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
      @click.stop="selectedImage = null"
    >
      <img :src="selectedImage" class="max-w-full max-h-full rounded-lg" />
      <button class="absolute top-4 right-4 text-white p-2">
        <XIcon class="w-6 h-6" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import {
  ArrowBigUp as ArrowBigUpIcon,
  ArrowBigDown as ArrowBigDownIcon,
  MessageCircle as MessageCircleIcon,
  X as XIcon,
} from "lucide-vue-next";
import type { Post } from "@/services/social";
import { socialService } from "@/services/social";

const props = defineProps<{
  post: Post;
}>();

const emit = defineEmits<{
  (e: "update:post", post: Post): void;
  (e: "show-comments"): void;
}>();

const selectedImage = ref<string | null>(null);

const gridClass = computed(() => {
  const count = props.post.images?.length || 0;
  if (count === 1) return "grid-cols-1";
  if (count === 2) return "grid-cols-2";
  return "grid-cols-2";
});

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
};

const openImage = (img: string) => {
  selectedImage.value = img;
};

const handleVote = async (type: 1 | -1) => {
  try {
    const newVoteType = await socialService.votePost(props.post.id, type);

    let voteDiff = 0;
    if (props.post.user_vote === type) {
      voteDiff = type === 1 ? -1 : 1;
    } else if (props.post.user_vote === 0) {
      voteDiff = type === 1 ? 1 : -1;
    } else {
      voteDiff = type === 1 ? 2 : -2;
    }

    emit("update:post", {
      ...props.post,
      user_vote: newVoteType,
      vote_count: (props.post.vote_count || 0) + voteDiff,
    });
  } catch {}
};
</script>
