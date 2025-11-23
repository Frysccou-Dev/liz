<template>
  <div class="min-h-screen py-12 px-4">
    <div class="max-w-5xl mx-auto space-y-8">
      <div v-if="loadingProfile" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>

      <template v-else-if="displayProfile">
        <ProfileHeader
          :user="null"
          :profile="displayProfile"
          :is-own-profile="false"
          :is-following="isFollowing"
          @toggle-follow="handleToggleFollow"
        />

        <ProfileTabs v-model:activeTab="activeTab" :tabs="tabs" />

        <ProfilePosts
          v-if="activeTab === 'posts'"
          :posts="userPosts"
          :loading="loadingPosts"
          :has-more="hasMorePosts"
          @update:post="updatePost"
          @open-post="selectedPost = $event"
        />

        <div
          v-else-if="activeTab === 'overview'"
          class="p-8 text-center text-gray-500 bg-white rounded-2xl shadow-sm"
        >
          <p>User lists are private.</p>
        </div>

        <div
          v-else-if="activeTab === 'anime' || activeTab === 'manga'"
          class="p-8 text-center text-gray-500 bg-white rounded-2xl shadow-sm"
        >
          <p>Media lists are private.</p>
        </div>
      </template>
    </div>

    <PostDetailModal
      v-if="selectedPost"
      :post="selectedPost"
      @close="selectedPost = null"
      @update:post="updatePost"
    />

    <Loader ref="loaderRef" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth";
import { socialService, type Post, type Profile } from "@/services/social";
import Loader from "@/components/layout/loader.vue";

import ProfileHeader from "./components/profile-header.vue";
import ProfileTabs from "./components/profile-tabs.vue";
import ProfilePosts from "./components/profile-posts.vue";
import PostDetailModal from "@/views/social/components/post-detail-modal.vue";

const { user: currentUser } = useAuth();
const router = useRouter();
const route = useRoute();
const loaderRef = ref<InstanceType<typeof Loader>>();

const displayProfile = ref<Profile | null>(null);
const isFollowing = ref(false);
const loadingProfile = ref(true);

const activeTab = ref("posts");
const tabs = [
  { id: "posts", label: "Posts" },
  { id: "overview", label: "Overview" },
  { id: "anime", label: "Anime List" },
  { id: "manga", label: "Manga List" },
];

const userPosts = ref<Post[]>([]);
const loadingPosts = ref(false);
const postsPage = ref(0);
const hasMorePosts = ref(true);
const selectedPost = ref<Post | null>(null);

const fetchUserPosts = async (reset = false) => {
  if (loadingPosts.value || (!hasMorePosts.value && !reset)) return;
  if (!displayProfile.value?.id) return;

  loadingPosts.value = true;
  if (reset) {
    postsPage.value = 0;
    userPosts.value = [];
    hasMorePosts.value = true;
  }

  try {
    const newPosts = await socialService.getUserPosts(displayProfile.value.id, postsPage.value);
    if (newPosts.length < 10) {
      hasMorePosts.value = false;
    }
    userPosts.value.push(...newPosts);
    postsPage.value++;
  } catch (error) {
    console.error(error);
  } finally {
    loadingPosts.value = false;
  }
};

const handlePostsScroll = () => {
  const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - 100 && activeTab.value === "posts") {
    fetchUserPosts();
  }
};

const updatePost = (updatedPost: Post) => {
  const index = userPosts.value.findIndex((p) => p.id === updatedPost.id);
  if (index !== -1) {
    userPosts.value[index] = updatedPost;
  }
};

const loadProfileData = async (userId: string) => {
  if (userId === currentUser.value?.id) {
    router.replace({ name: "Profile" });
    return;
  }

  if (loaderRef.value) loaderRef.value.showLoader();
  loadingProfile.value = true;
  try {
    const profileData = await socialService.getProfile(userId);
    displayProfile.value = profileData;
    isFollowing.value = profileData.is_following || false;

    userPosts.value = [];

    fetchUserPosts(true);
  } catch (e) {
    console.error(e);
    router.push({ name: "NotFound" });
  } finally {
    loadingProfile.value = false;
    if (loaderRef.value) loaderRef.value.hideLoader();
  }
};

const handleToggleFollow = async () => {
  if (!displayProfile.value) return;

  try {
    if (isFollowing.value) {
      await socialService.unfollowUser(displayProfile.value.id);
      isFollowing.value = false;
      if (displayProfile.value.followers_count) displayProfile.value.followers_count--;
    } else {
      await socialService.followUser(displayProfile.value.id);
      isFollowing.value = true;
      displayProfile.value.followers_count = (displayProfile.value.followers_count || 0) + 1;
    }
  } catch (error) {
    console.error(error);
  }
};

onMounted(async () => {
  const userId = route.params.userId as string;
  if (userId) {
    await loadProfileData(userId);
  }
  window.addEventListener("scroll", handlePostsScroll);
});

watch(
  () => route.params.userId,
  async (newId) => {
    if (newId) {
      await loadProfileData(newId as string);
    }
  }
);

onUnmounted(() => {
  window.removeEventListener("scroll", handlePostsScroll);
});
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
  opacity: 0;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
