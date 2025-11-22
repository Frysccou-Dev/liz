<template>
  <div class="min-h-screen py-12 px-4">
    <div class="max-w-5xl mx-auto space-y-8">
      <ProfileHeader
        :user="user"
        :profile="profile"
        @sign-out="handleSignOut"
        @show-followers="showFollowersModal = true"
        @show-following="showFollowingModal = true"
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

      <ProfileOverview
        v-else-if="activeTab === 'overview'"
        :lists="lists"
        :loading="loadingLists"
        @create-list="showCreateListModal = true"
        @open-list="openListDetails"
        @delete-list="deleteList"
      />

      <ProfileMediaList
        v-else-if="activeTab === 'anime' || activeTab === 'manga'"
        :media-list="activeTab === 'anime' ? animeList : mangaList"
        :loading="loadingMedia"
        :type="activeTab === 'anime' ? 'anime' : 'manga'"
        :media-statuses="mediaStatuses"
        @go-to-media="goToMedia"
      />
    </div>

    <CreateListModal
      v-if="showCreateListModal"
      v-model:name="newListName"
      v-model:description="newListDesc"
      :loading="creatingList"
      @close="showCreateListModal = false"
      @submit="createList"
    />

    <ListDetailsModal
      v-if="showListDetailsModal"
      :list="selectedList"
      :items="selectedListItems"
      :loading="loadingListItems"
      @close="closeListDetails"
      @go-to-media="goToMedia"
      @remove-item="removeListItem"
    />

    <FollowersModal
      v-if="showFollowersModal"
      title="Followers"
      :users="followers"
      :loading="loadingFollowers"
      empty-message="No followers yet"
      :current-user-id="user?.id"
      @close="showFollowersModal = false"
      @toggle-follow="toggleFollowInModal"
    />

    <FollowersModal
      v-if="showFollowingModal"
      title="Following"
      :users="following"
      :loading="loadingFollowing"
      empty-message="Not following anyone yet"
      :current-user-id="user?.id"
      @close="showFollowingModal = false"
      @toggle-follow="toggleFollowInModal"
    />

    <PostDetailModal
      v-if="selectedPost"
      :post="selectedPost"
      @close="selectedPost = null"
      @update:post="updatePost"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth";
import {
  userListService,
  type CustomList,
  type ListItem,
  type MediaStatus,
} from "@/services/user-lists";
import { socialService, type Post, type Profile } from "@/services/social";

import ProfileHeader from "./components/profile-header.vue";
import ProfileTabs from "./components/profile-tabs.vue";
import ProfileOverview from "./components/profile-overview.vue";
import ProfileMediaList from "./components/profile-media-list.vue";
import ProfilePosts from "./components/profile-posts.vue";
import CreateListModal from "./components/create-list-modal.vue";
import ListDetailsModal from "./components/list-details-modal.vue";
import FollowersModal from "./components/followers-modal.vue";
import PostDetailModal from "@/views/social/components/post-detail-modal.vue";

const { user, profile, signOut } = useAuth();
const router = useRouter();

const activeTab = ref("posts");
const tabs = [
  { id: "posts", label: "Posts" },
  { id: "overview", label: "Overview" },
  { id: "anime", label: "Anime List" },
  { id: "manga", label: "Manga List" },
];

const lists = ref<CustomList[]>([]);
const loadingLists = ref(true);
const showCreateListModal = ref(false);
const newListName = ref("");
const newListDesc = ref("");
const creatingList = ref(false);

const showListDetailsModal = ref(false);
const selectedList = ref<CustomList | null>(null);
const selectedListItems = ref<ListItem[]>([]);
const loadingListItems = ref(false);

const animeList = ref<MediaStatus[]>([]);
const mangaList = ref<MediaStatus[]>([]);
const mediaStatuses = ["WATCHING", "COMPLETED", "PLAN_TO_WATCH", "DROPPED", "ON_HOLD"];
const loadingMedia = ref(true);

const userPosts = ref<Post[]>([]);
const loadingPosts = ref(false);
const postsPage = ref(0);
const hasMorePosts = ref(true);
const selectedPost = ref<Post | null>(null);

const showFollowersModal = ref(false);
const showFollowingModal = ref(false);
const followers = ref<Profile[]>([]);
const following = ref<Profile[]>([]);
const loadingFollowers = ref(false);
const loadingFollowing = ref(false);

const handleSignOut = async () => {
  await signOut();
};

const fetchLists = async () => {
  try {
    lists.value = await userListService.getCustomLists();
  } catch (error) {
    console.error(error);
  } finally {
    loadingLists.value = false;
  }
};

const fetchMediaLists = async () => {
  try {
    const [anime, manga] = await Promise.all([
      userListService.getUserMediaStatus("ANIME"),
      userListService.getUserMediaStatus("MANGA"),
    ]);
    animeList.value = anime;
    mangaList.value = manga;
  } catch (error) {
    console.error(error);
  } finally {
    loadingMedia.value = false;
  }
};

const createList = async () => {
  creatingList.value = true;
  try {
    const newList = await userListService.createCustomList(newListName.value, newListDesc.value);
    if (newList) {
      lists.value.unshift(newList);
    }
    showCreateListModal.value = false;
    newListName.value = "";
    newListDesc.value = "";
  } catch (error) {
    console.error(error);
  } finally {
    creatingList.value = false;
  }
};

const deleteList = async (id: number) => {
  if (!confirm("Are you sure you want to delete this list?")) return;
  try {
    await userListService.deleteCustomList(id);
    lists.value = lists.value.filter((l) => l.id !== id);
  } catch (error) {
    console.error(error);
  }
};

const openListDetails = async (list: CustomList) => {
  selectedList.value = list;
  showListDetailsModal.value = true;
  loadingListItems.value = true;
  try {
    selectedListItems.value = await userListService.getListItems(list.id);
  } catch (error) {
    console.error(error);
  } finally {
    loadingListItems.value = false;
  }
};

const closeListDetails = () => {
  showListDetailsModal.value = false;
  selectedList.value = null;
  selectedListItems.value = [];
};

const removeListItem = async (item: ListItem) => {
  if (!confirm("Remove this item from the list?")) return;
  try {
    await userListService.removeFromList(item.list_id, item.media_id, item.media_type);
    selectedListItems.value = selectedListItems.value.filter((i) => i.id !== item.id);
  } catch (error) {
    console.error(error);
  }
};

const fetchUserPosts = async (reset = false) => {
  if (loadingPosts.value || (!hasMorePosts.value && !reset)) return;
  if (!user.value?.id) return;

  loadingPosts.value = true;
  if (reset) {
    postsPage.value = 0;
    userPosts.value = [];
    hasMorePosts.value = true;
  }

  try {
    const newPosts = await socialService.getUserPosts(user.value.id, postsPage.value);
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

const fetchFollowers = async () => {
  if (!user.value?.id) return;
  loadingFollowers.value = true;
  try {
    followers.value = await socialService.getFollowers(user.value.id);
  } catch (error) {
    console.error(error);
  } finally {
    loadingFollowers.value = false;
  }
};

const fetchFollowing = async () => {
  if (!user.value?.id) return;
  loadingFollowing.value = true;
  try {
    following.value = await socialService.getFollowing(user.value.id);
  } catch (error) {
    console.error(error);
  } finally {
    loadingFollowing.value = false;
  }
};

const toggleFollowInModal = async (targetUser: Profile) => {
  try {
    if (targetUser.is_following) {
      await socialService.unfollowUser(targetUser.id);
      targetUser.is_following = false;
      if (targetUser.followers_count) targetUser.followers_count--;
    } else {
      await socialService.followUser(targetUser.id);
      targetUser.is_following = true;
      targetUser.followers_count = (targetUser.followers_count || 0) + 1;
    }
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => {
  fetchLists();
  fetchMediaLists();
  fetchUserPosts(true);
  fetchFollowers();
  fetchFollowing();
  window.addEventListener("scroll", handlePostsScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handlePostsScroll);
});

const goToMedia = (id: number, type: string) => {
  if (type === "ANIME") {
    router.push({ name: "AnimeDetail", params: { id } });
  } else if (type === "MANGA") {
    router.push({ name: "MangaDetail", params: { id } });
  }
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
  opacity: 0;
}

.animate-scale-in {
  animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
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
</style>
