<template>
  <div class="min-h-screen bg-white pb-20 md:pb-0">
    <div class="max-w-7xl mx-auto flex justify-center">
      <div class="w-full max-w-2xl border-x border-gray-100 min-h-screen">
        <div
          class="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 p-4 flex justify-between items-center"
        >
          <h2 class="text-xl font-bold text-gray-400">Community</h2>
          <button
            @click="showCreateModal = true"
            class="md:hidden p-2 bg-gray-900 text-white rounded-full"
          >
            <PlusIcon class="w-5 h-5" />
          </button>
        </div>

        <div
          class="hidden md:block p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
          @click="showCreateModal = true"
        >
          <div class="flex gap-3">
            <div class="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
              <img
                v-if="profile?.avatar_url"
                :src="profile.avatar_url"
                class="w-full h-full object-cover"
              />
              <div
                v-else
                class="w-full h-full flex items-center justify-center text-gray-500 font-medium"
              >
                {{ profile?.username?.charAt(0).toUpperCase() }}
              </div>
            </div>
            <div class="flex-1">
              <div class="w-full bg-gray-100 rounded-full py-2.5 px-4 text-gray-500 text-sm">
                What's happening?
              </div>
            </div>
          </div>
        </div>

        <div class="divide-y divide-gray-100">
          <div v-if="loading" class="p-8 text-center text-gray-400">Loading...</div>
          <div v-else-if="error" class="p-8 text-center text-red-500 bg-red-50 m-4 rounded-lg">
            <p class="font-medium">Error loading posts</p>
            <p class="text-sm mt-1">{{ error }}</p>
            <button
              @click="fetchPosts(true)"
              class="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline"
            >
              Try Again
            </button>
          </div>
          <div v-else-if="posts.length === 0" class="p-8 text-center text-gray-400">
            No posts yet. Be the first!
          </div>
          <PostCard
            v-for="(post, index) in posts"
            :key="post.id"
            :post="post"
            class="border-none rounded-none hover:bg-gray-50/50 cursor-pointer"
            :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-50'"
            @update:post="updatePost"
            @click="selectedPost = post"
          />
        </div>
      </div>

      <div class="hidden lg:block w-80 pl-8 pt-4">
        <div class="sticky top-4 space-y-6">
          <div class="relative group">
            <SearchIcon
              class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-gray-900"
            />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search profiles"
              class="w-full bg-gray-100 border-none rounded-full py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-gray-900 focus:bg-white transition-all"
              @input="handleSearch"
            />

            <div
              v-if="searchResults.length > 0"
              class="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-20"
            >
              <div
                v-for="user in searchResults"
                :key="user.id"
                class="p-3 hover:bg-gray-50 flex items-center justify-between cursor-pointer"
              >
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                    <img
                      v-if="user.avatar_url"
                      :src="user.avatar_url"
                      class="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p class="font-bold text-sm text-gray-900">{{ user.username }}</p>
                    <p class="text-xs text-gray-500">{{ user.followers_count }} followers</p>
                  </div>
                </div>
                <button
                  @click.stop="toggleFollow(user)"
                  class="px-3 py-1 rounded-full text-xs font-medium transition-colors"
                  :class="
                    user.is_following
                      ? 'border border-gray-200 text-gray-900 hover:bg-red-50 hover:text-red-600 hover:border-red-200'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  "
                >
                  {{ user.is_following ? "Following" : "Follow" }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <CreatePostModal
      v-if="showCreateModal"
      @close="showCreateModal = false"
      @created="handlePostCreated"
    />

    <PostDetailModal
      v-if="selectedPost"
      :post="selectedPost"
      @close="selectedPost = null"
      @update:post="updatePost"
    />

    <button
      @click="showCreateModal = true"
      class="md:hidden fixed bottom-20 right-4 w-14 h-14 bg-gray-900 text-white rounded-full shadow-lg flex items-center justify-center z-40"
    >
      <PlusIcon class="w-6 h-6" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { Search as SearchIcon, Plus as PlusIcon } from "lucide-vue-next";
import { useAuth } from "@/composables/useAuth";
import { socialService, type Post, type Profile } from "@/services/social";
import PostCard from "./components/post-card.vue";
import CreatePostModal from "./components/create-post-modal.vue";
import PostDetailModal from "./components/post-detail-modal.vue";

const { profile } = useAuth();
const posts = ref<Post[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const showCreateModal = ref(false);
const selectedPost = ref<Post | null>(null);
const searchQuery = ref("");
const searchResults = ref<Profile[]>([]);
const page = ref(0);
const hasMore = ref(true);

const fetchPosts = async (reset = false) => {
  if (loading.value || (!hasMore.value && !reset)) return;

  loading.value = true;
  error.value = null;
  if (reset) {
    page.value = 0;
    posts.value = [];
    hasMore.value = true;
  }

  try {
    const newPosts = await socialService.getPosts(page.value);
    if (newPosts.length < 10) {
      hasMore.value = false;
    }
    posts.value.push(...newPosts);
    page.value++;
  } catch (e: unknown) {
    console.error("Failed to fetch posts:", e);
    const message =
      e instanceof Error
        ? e.message
        : "Failed to load posts. Please check your connection and configuration.";
    error.value = message;
  } finally {
    loading.value = false;
  }
};

const handleScroll = () => {
  const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - 100) {
    fetchPosts();
  }
};

const handlePostCreated = () => {
  fetchPosts(true);
};

const updatePost = (updatedPost: Post) => {
  const index = posts.value.findIndex((p) => p.id === updatedPost.id);
  if (index !== -1) {
    posts.value[index] = updatedPost;
  }
};

const handleSearch = async () => {
  if (!searchQuery.value.trim()) {
    searchResults.value = [];
    return;
  }
  try {
    searchResults.value = await socialService.searchProfiles(searchQuery.value);
  } catch {}
};

const toggleFollow = async (user: Profile) => {
  try {
    if (user.is_following) {
      await socialService.unfollowUser(user.id);
      user.is_following = false;
      user.followers_count--;
    } else {
      await socialService.followUser(user.id);
      user.is_following = true;
      user.followers_count++;
    }
  } catch {}
};

onMounted(() => {
  fetchPosts(true);
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>
