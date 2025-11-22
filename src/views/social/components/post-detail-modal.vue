<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center px-4">
    <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="$emit('close')"></div>

    <div
      class="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] relative z-10 flex flex-col shadow-2xl animate-scale-in"
      @click.stop
    >
      <div class="p-4 border-b border-gray-100 flex justify-between items-center shrink-0">
        <div class="flex items-center gap-3">
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
          <div>
            <h3 class="font-bold text-gray-900">{{ post.profiles?.username }}</h3>
            <p class="text-xs text-gray-500">{{ formatDate(post.created_at) }}</p>
          </div>
        </div>

        <button
          @click="$emit('close')"
          class="p-2 hover:bg-gray-100 rounded-full text-gray-500 hover:text-gray-900 transition-colors"
        >
          <XIcon class="w-6 h-6" />
        </button>
      </div>

      <div class="p-6 overflow-y-auto custom-scrollbar">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">{{ post.title }}</h2>

        <p class="text-gray-800 text-lg whitespace-pre-wrap mb-6 leading-relaxed">
          {{ post.content }}
        </p>

        <div v-if="post.images?.length" class="grid grid-cols-2 gap-2 mb-6">
          <div
            v-for="(img, idx) in post.images"
            :key="idx"
            class="rounded-xl overflow-hidden bg-gray-100 shadow-sm flex justify-center items-center bg-black/5 aspect-[4/5] cursor-pointer hover:opacity-95 transition-opacity"
            :class="{
              'col-span-2': post.images.length === 1 || (post.images.length === 3 && idx === 0),
            }"
            @click.stop="openImage(img)"
          >
            <img :src="img" class="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      <div
        class="p-4 border-t border-gray-100 bg-gray-50 shrink-0 flex justify-between items-center"
      >
        <div class="flex items-center gap-4">
          <div class="flex items-center bg-white rounded-full border border-gray-200 p-1 shadow-sm">
            <button
              @click="handleVote(1)"
              class="p-2 rounded-full hover:bg-green-50 text-gray-500 hover:text-green-600 transition-colors"
              :class="{ 'text-green-600 bg-green-50': post.user_vote === 1 }"
            >
              <ArrowBigUpIcon class="w-6 h-6" />
            </button>
            <span class="font-bold text-gray-900 min-w-8 text-center">{{ post.vote_count }}</span>
            <button
              @click="handleVote(-1)"
              class="p-2 rounded-full hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors"
              :class="{ 'text-red-600 bg-red-50': post.user_vote === -1 }"
            >
              <ArrowBigDownIcon class="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="selectedImage"
      class="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4"
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
import { ref } from "vue";
import {
  X as XIcon,
  ArrowBigUp as ArrowBigUpIcon,
  ArrowBigDown as ArrowBigDownIcon,
} from "lucide-vue-next";
import type { Post } from "@/services/social";
import { socialService } from "@/services/social";

const props = defineProps<{
  post: Post;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "update:post", post: Post): void;
}>();

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const selectedImage = ref<string | null>(null);

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

<style scoped>
.animate-scale-in {
  animation: scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 20px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0, 0, 0, 0.2);
}
</style>
