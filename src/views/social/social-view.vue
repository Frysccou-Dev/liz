<template>
  <div class="min-h-screen bg-white">
    <section class="pt-16 pb-8 px-6">
      <div class="max-w-4xl mx-auto text-center">
        <span class="text-xs uppercase tracking-[0.3em] text-gray-400 mb-4 block">Connect</span>
        <h1 class="text-5xl md:text-6xl font-light text-gray-200 tracking-tight mb-4">Community</h1>
        <p class="text-gray-500 font-light max-w-md mx-auto">
          Share your thoughts and connect with other anime fans
        </p>
      </div>
    </section>

    <section class="pb-24 px-6">
      <div class="max-w-2xl mx-auto">
        <div
          v-if="profile"
          class="mb-8 p-6 bg-gray-50 rounded-2xl cursor-pointer hover:bg-gray-100 transition-colors"
          @click="showCreateModal = true"
        >
          <div class="flex gap-4 items-center">
            <div class="w-12 h-12 rounded-full bg-gray-200 overflow-hidden shrink-0">
              <img
                v-if="profile.avatar_url"
                :src="profile.avatar_url"
                class="w-full h-full object-cover"
              />
              <div
                v-else
                class="w-full h-full flex items-center justify-center text-gray-500 font-medium"
              >
                {{ profile.username?.charAt(0).toUpperCase() }}
              </div>
            </div>
            <div class="flex-1">
              <div class="text-gray-400 font-light">What's on your mind?</div>
            </div>
            <PlusIcon class="w-5 h-5 text-gray-400" />
          </div>
        </div>

        <div class="mb-8">
          <div class="relative">
            <SearchIcon class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search profiles..."
              class="w-full bg-gray-50 border-none rounded-xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-gray-200 focus:bg-white transition-all"
              @input="handleSearch"
            />
          </div>

          <div
            v-if="searchResults.length > 0"
            class="mt-4 bg-white rounded-xl border border-gray-100 overflow-hidden"
          >
            <div
              v-for="user in searchResults"
              :key="user.id"
              class="p-4 hover:bg-gray-50 flex items-center justify-between cursor-pointer border-b border-gray-50 last:border-b-0"
              @click="goToProfile(user)"
            >
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                  <img
                    v-if="user.avatar_url"
                    :src="user.avatar_url"
                    class="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p class="font-medium text-gray-900">{{ user.username }}</p>
                  <p class="text-xs text-gray-500">{{ user.followers_count }} followers</p>
                </div>
              </div>
              <button
                @click.stop="toggleFollow(user)"
                class="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                :class="
                  user.is_following
                    ? 'border border-gray-200 text-gray-700 hover:border-gray-400'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                "
              >
                {{ user.is_following ? "Following" : "Follow" }}
              </button>
            </div>
          </div>
        </div>

        <div class="space-y-1">
          <div v-if="loading" class="py-20 text-center">
            <div
              class="w-8 h-8 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto"
            ></div>
            <p class="text-gray-400 mt-4 font-light">Loading posts...</p>
          </div>

          <div v-else-if="error" class="py-20 text-center">
            <p class="text-gray-900 font-medium mb-2">Error loading posts</p>
            <p class="text-sm text-gray-500 mb-4">{{ error }}</p>
            <button
              @click="fetchPosts(true)"
              class="text-sm text-gray-900 underline hover:no-underline"
            >
              Try Again
            </button>
          </div>

          <div v-else-if="posts.length === 0" class="py-20 text-center">
            <div
              class="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4"
            >
              <MessageSquareIcon class="w-6 h-6 text-gray-400" />
            </div>
            <p class="text-gray-900 font-medium mb-2">No posts yet</p>
            <p class="text-sm text-gray-500">Be the first to share something!</p>
          </div>

          <div v-else>
            <PostCard
              v-for="post in posts"
              :key="post.id"
              :post="post"
              class="bg-white hover:bg-gray-50 transition-colors rounded-xl mb-4 border border-gray-100"
              @update:post="updatePost"
              @click="selectedPost = post"
              @show-comments="selectedPost = post"
            />
          </div>
        </div>
      </div>
    </section>

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
      v-if="profile"
      @click="showCreateModal = true"
      class="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-gray-900 text-white rounded-full shadow-lg flex items-center justify-center z-40 hover:bg-gray-800 transition-colors"
    >
      <PlusIcon class="w-6 h-6" />
    </button>

    <Loader ref="loaderRef" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import {
  Search as SearchIcon,
  Plus as PlusIcon,
  MessageSquare as MessageSquareIcon,
} from "lucide-vue-next";
import { useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth";
import { socialService, type Post, type Profile } from "@/services/social";
import PostCard from "./components/post-card.vue";
import CreatePostModal from "./components/create-post-modal.vue";
import PostDetailModal from "./components/post-detail-modal.vue";
import Loader from "@/components/layout/loader.vue";

const { profile } = useAuth();
const router = useRouter();
const loaderRef = ref<InstanceType<typeof Loader>>();
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
    loaderRef.value?.showLoader();
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
    const message = e instanceof Error ? e.message : "Failed to load posts.";
    error.value = message;
  } finally {
    loading.value = false;
    if (reset) {
      loaderRef.value?.hideLoader();
    }
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

const goToProfile = (user: Profile) => {
  router.push({ name: "UserProfile", params: { userId: user.id } });
  searchQuery.value = "";
  searchResults.value = [];
};

onMounted(() => {
  fetchPosts(true);
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>
