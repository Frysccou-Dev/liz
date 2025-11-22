<template>
  <div
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-2xl w-full max-w-lg max-h-[80vh] flex flex-col shadow-2xl">
      <div class="flex items-center justify-between p-6 border-b border-gray-100">
        <h3 class="text-xl font-bold text-gray-900">{{ title }}</h3>
        <button
          @click="$emit('close')"
          class="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <XIcon class="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <div class="flex-1 overflow-y-auto">
        <div v-if="loading" class="p-8 text-center text-gray-400">
          <div
            class="animate-spin w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full mx-auto"
          ></div>
        </div>

        <div v-else-if="users.length === 0" class="p-8 text-center text-gray-400">
          {{ emptyMessage }}
        </div>

        <div v-else class="divide-y divide-gray-100">
          <div
            v-for="user in users"
            :key="user.id"
            class="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between"
          >
            <div class="flex items-center gap-3 flex-1 min-w-0">
              <div
                class="w-12 h-12 rounded-full bg-linear-to-br from-purple-400 to-pink-400 overflow-hidden shrink-0"
              >
                <img
                  v-if="user.avatar_url"
                  :src="user.avatar_url"
                  class="w-full h-full object-cover"
                />
                <div
                  v-else
                  class="w-full h-full flex items-center justify-center text-white font-bold text-lg"
                >
                  {{ user.username?.charAt(0).toUpperCase() }}
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-bold text-gray-900 truncate">{{ user.username }}</p>
                <p class="text-sm text-gray-500">
                  {{ user.followers_count }} followers • {{ user.following_count }} following
                </p>
              </div>
            </div>
            <button
              v-if="user.id !== currentUserId"
              @click="toggleFollow(user)"
              class="px-4 py-2 rounded-full text-sm font-medium transition-all shrink-0 ml-3"
              :class="
                user.is_following
                  ? 'border border-gray-200 text-gray-900 hover:bg-red-50 hover:text-red-600 hover:border-red-200'
                  : 'bg-gray-900 text-white hover:bg-gray-800 hover:shadow-lg'
              "
            >
              {{ user.is_following ? "Following" : "Follow" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { X as XIcon } from "lucide-vue-next";
import type { Profile } from "@/services/social";

defineProps<{
  title: string;
  users: Profile[];
  loading: boolean;
  emptyMessage: string;
  currentUserId?: string;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "toggle-follow", user: Profile): void;
}>();

const toggleFollow = (user: Profile) => {
  emit("toggle-follow", user);
};
</script>
