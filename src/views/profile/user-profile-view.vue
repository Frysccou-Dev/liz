<template>
  <div class="min-h-screen bg-white">
    <div v-if="loadingProfile" class="flex justify-center items-center py-32">
      <div
        class="w-8 h-8 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin"
      ></div>
    </div>

    <template v-else-if="displayProfile">
      <section class="pt-16 pb-8 px-6">
        <div class="max-w-4xl mx-auto">
          <div class="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div
              class="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gray-100 flex items-center justify-center text-3xl font-light text-gray-400 overflow-hidden"
            >
              <img
                v-if="displayProfile.avatar_url"
                :src="displayProfile.avatar_url"
                alt="Avatar"
                class="w-full h-full object-cover"
              />
              <span v-else>{{ displayProfile.username?.charAt(0).toUpperCase() }}</span>
            </div>

            <div class="flex-1 text-center md:text-left">
              <h2 class="text-2xl md:text-3xl font-medium text-gray-900 mb-1">
                {{ displayProfile.username }}
              </h2>
              <p class="text-gray-500 font-light mb-4">@{{ displayProfile.username }}</p>

              <div class="flex justify-center md:justify-start gap-6">
                <div class="text-center">
                  <div class="text-xl font-medium text-gray-900">
                    {{ displayProfile.followers_count || 0 }}
                  </div>
                  <div class="text-xs uppercase tracking-wider text-gray-400">Followers</div>
                </div>
                <div class="text-center">
                  <div class="text-xl font-medium text-gray-900">
                    {{ displayProfile.following_count || 0 }}
                  </div>
                  <div class="text-xs uppercase tracking-wider text-gray-400">Following</div>
                </div>
              </div>
            </div>

            <button
              @click="handleToggleFollow"
              class="px-6 py-3 rounded-xl font-medium transition-all"
              :class="
                isFollowing
                  ? 'border border-gray-200 text-gray-700 hover:border-red-300 hover:text-red-500'
                  : 'bg-gray-900 text-white hover:bg-gray-800'
              "
            >
              {{ isFollowing ? "Following" : "Follow" }}
            </button>
          </div>
        </div>
      </section>

      <section class="px-6 mb-8">
        <div class="max-w-4xl mx-auto">
          <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              class="px-5 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap"
              :class="
                activeTab === tab.id
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              "
            >
              {{ tab.label }}
            </button>
          </div>
        </div>
      </section>

      <section class="px-6 pb-24">
        <div class="max-w-4xl mx-auto">
          <div v-if="activeTab === 'posts'">
            <div v-if="loadingPosts && userPosts.length === 0" class="py-20 text-center">
              <div
                class="w-8 h-8 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto"
              ></div>
            </div>

            <div v-else-if="userPosts.length === 0" class="py-20 text-center">
              <div
                class="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4"
              >
                <MessageSquareIcon class="w-6 h-6 text-gray-400" />
              </div>
              <p class="text-gray-900 font-medium mb-2">No posts yet</p>
              <p class="text-sm text-gray-500">This user hasn't posted anything</p>
            </div>

            <div v-else class="space-y-4">
              <PostCard
                v-for="post in userPosts"
                :key="post.id"
                :post="post"
                class="bg-white border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors"
                @update:post="updatePost"
                @click="selectedPost = post"
              />
            </div>
          </div>

          <div v-else class="py-20 text-center">
            <div
              class="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4"
            >
              <LockIcon class="w-6 h-6 text-gray-400" />
            </div>
            <p class="text-gray-900 font-medium mb-2">Private</p>
            <p class="text-sm text-gray-500">This content is only visible to the profile owner</p>
          </div>
        </div>
      </section>
    </template>

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
import { MessageSquare as MessageSquareIcon, Lock as LockIcon } from "lucide-vue-next";
import PostCard from "@/views/social/components/post-card.vue";
import PostDetailModal from "@/views/social/components/post-detail-modal.vue";
import Loader from "@/components/layout/loader.vue";

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
  { id: "lists", label: "Lists" },
  { id: "anime", label: "Anime" },
  { id: "manga", label: "Manga" },
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
  },
);

onUnmounted(() => {
  window.removeEventListener("scroll", handlePostsScroll);
});
</script>
