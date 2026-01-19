<template>
  <div class="min-h-screen bg-white">
    <section class="pt-16 pb-8 px-6">
      <div class="max-w-4xl mx-auto">
        <div class="flex flex-col md:flex-row items-center md:items-start gap-8">
          <div class="relative group">
            <div
              class="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gray-100 flex items-center justify-center text-3xl font-light text-gray-400 overflow-hidden"
            >
              <img
                v-if="profile?.avatar_url"
                :src="profile.avatar_url"
                alt="Avatar"
                class="w-full h-full object-cover"
              />
              <span v-else>{{ user?.email?.charAt(0).toUpperCase() }}</span>
            </div>
            <button
              @click="startEditing"
              class="absolute bottom-1 right-1 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Edit2Icon class="w-4 h-4" />
            </button>
          </div>

          <div class="flex-1 text-center md:text-left">
            <div v-if="isEditing" class="max-w-sm mx-auto md:mx-0">
              <input
                v-model="newAvatarUrl"
                type="text"
                placeholder="Paste image URL..."
                class="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-gray-200 mb-3"
                @keyup.enter="saveAvatar"
              />
              <div class="flex gap-2">
                <button
                  @click="saveAvatar"
                  class="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800"
                  :disabled="avatarLoading"
                >
                  {{ avatarLoading ? "Saving..." : "Save" }}
                </button>
                <button
                  @click="cancelEditing"
                  class="px-4 py-2 bg-gray-100 text-gray-600 text-sm rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
              </div>
            </div>

            <div v-else>
              <h2 class="text-2xl md:text-3xl font-medium text-gray-900 mb-1">
                {{ profile?.username || "User" }}
              </h2>
              <p class="text-gray-500 font-light mb-4">{{ user?.email }}</p>

              <div class="flex justify-center md:justify-start gap-6">
                <div class="text-center">
                  <div class="text-xl font-medium text-gray-900">
                    {{ profile?.followers_count || 0 }}
                  </div>
                  <div class="text-xs uppercase tracking-wider text-gray-400">Followers</div>
                </div>
                <div class="text-center">
                  <div class="text-xl font-medium text-gray-900">
                    {{ profile?.following_count || 0 }}
                  </div>
                  <div class="text-xs uppercase tracking-wider text-gray-400">Following</div>
                </div>
              </div>
            </div>
          </div>

          <button
            @click="handleSignOut"
            class="px-6 py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all font-light"
          >
            Sign Out
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
            <p class="text-sm text-gray-500">Your posts will appear here</p>
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

        <div v-else-if="activeTab === 'lists'">
          <div class="flex justify-between items-center mb-8">
            <div>
              <span class="text-xs uppercase tracking-[0.2em] text-gray-400 block mb-1"
                >Collection</span
              >
              <h2 class="text-xl font-light text-gray-900">Your Lists</h2>
            </div>
            <button
              @click="showCreateListModal = true"
              class="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              <PlusIcon class="w-4 h-4" />
              New List
            </button>
          </div>

          <div v-if="loadingLists" class="py-20 text-center">
            <div
              class="w-8 h-8 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto"
            ></div>
          </div>

          <div v-else-if="lists.length === 0" class="py-20 text-center">
            <div
              class="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4"
            >
              <FolderIcon class="w-6 h-6 text-gray-400" />
            </div>
            <p class="text-gray-900 font-medium mb-2">No lists yet</p>
            <p class="text-sm text-gray-500">Create a list to organize your favorites</p>
          </div>

          <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="(list, index) in lists"
              :key="list.id"
              class="relative overflow-hidden rounded-2xl cursor-pointer group transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              :class="listColors[index % listColors.length]"
              @click="openListDetails(list)"
            >
              <div class="p-6 h-full flex flex-col">
                <div class="flex justify-between items-start mb-4">
                  <div class="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                    <FolderIcon class="w-6 h-6 text-white" />
                  </div>
                  <button
                    @click.stop="deleteList(list.id)"
                    class="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <TrashIcon class="w-4 h-4" />
                  </button>
                </div>
                <div class="flex-1 flex flex-col justify-end">
                  <h3 class="text-lg font-semibold text-white mb-1">{{ list.name }}</h3>
                  <p v-if="list.description" class="text-sm text-white/70 line-clamp-2">
                    {{ list.description }}
                  </p>
                  <p v-else class="text-sm text-white/50">No description</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="activeTab === 'anime' || activeTab === 'manga'">
          <div class="mb-8">
            <span class="text-xs uppercase tracking-[0.2em] text-gray-400 block mb-1">Library</span>
            <h2 class="text-xl font-light text-gray-900">
              {{ activeTab === "anime" ? "Anime" : "Manga" }} List
            </h2>
          </div>

          <div v-if="loadingMedia" class="py-20 text-center">
            <div
              class="w-8 h-8 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto"
            ></div>
          </div>

          <div v-else-if="currentMediaList.length === 0" class="py-20 text-center">
            <div
              class="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4"
            >
              <TvIcon v-if="activeTab === 'anime'" class="w-6 h-6 text-gray-400" />
              <BookOpenIcon v-else class="w-6 h-6 text-gray-400" />
            </div>
            <p class="text-gray-900 font-medium mb-2">No {{ activeTab }} added yet</p>
            <p class="text-sm text-gray-500">Start adding {{ activeTab }} to your list</p>
          </div>

          <div v-else class="space-y-6">
            <div v-for="status in mediaStatuses" :key="status">
              <div v-if="getMediaByStatus(status).length > 0">
                <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
                  {{ formatStatus(status) }}
                </h3>
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  <div
                    v-for="item in getMediaByStatus(status)"
                    :key="item.id"
                    class="cursor-pointer group"
                    @click="goToMedia(item.media_id, activeTab === 'anime' ? 'ANIME' : 'MANGA')"
                  >
                    <div class="aspect-3/4 rounded-xl overflow-hidden bg-gray-100 mb-2">
                      <img
                        v-if="item.media_cover"
                        :src="item.media_cover"
                        :alt="item.media_title"
                        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <p
                      class="text-sm text-gray-900 font-medium line-clamp-2 group-hover:text-gray-600"
                    >
                      {{ item.media_title }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

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
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth";
import {
  Edit2 as Edit2Icon,
  Plus as PlusIcon,
  Trash as TrashIcon,
  Folder as FolderIcon,
  MessageSquare as MessageSquareIcon,
  Tv as TvIcon,
  BookOpen as BookOpenIcon,
} from "lucide-vue-next";
import {
  userListService,
  type CustomList,
  type ListItem,
  type MediaStatus,
} from "@/services/user-lists";
import { socialService, type Post } from "@/services/social";

import CreateListModal from "./components/create-list-modal.vue";
import ListDetailsModal from "./components/list-details-modal.vue";
import PostDetailModal from "@/views/social/components/post-detail-modal.vue";
import PostCard from "@/views/social/components/post-card.vue";
import Loader from "@/components/layout/loader.vue";

const { user, profile, signOut, updateAvatar } = useAuth();
const router = useRouter();
const loaderRef = ref<InstanceType<typeof Loader>>();

const isEditing = ref(false);
const newAvatarUrl = ref("");
const avatarLoading = ref(false);

const activeTab = ref("posts");
const tabs = [
  { id: "posts", label: "Posts" },
  { id: "lists", label: "Lists" },
  { id: "anime", label: "Anime" },
  { id: "manga", label: "Manga" },
];

const lists = ref<CustomList[]>([]);
const loadingLists = ref(true);
const showCreateListModal = ref(false);
const newListName = ref("");
const newListDesc = ref("");
const creatingList = ref(false);

const listColors = [
  "bg-gradient-to-br from-gray-800 to-gray-900",
  "bg-gradient-to-br from-slate-700 to-slate-900",
  "bg-gradient-to-br from-zinc-700 to-zinc-900",
  "bg-gradient-to-br from-neutral-700 to-neutral-900",
  "bg-gradient-to-br from-stone-700 to-stone-900",
];

const showListDetailsModal = ref(false);
const selectedList = ref<CustomList | null>(null);
const selectedListItems = ref<ListItem[]>([]);
const loadingListItems = ref(false);

const animeList = ref<MediaStatus[]>([]);
const mangaList = ref<MediaStatus[]>([]);
const mediaStatuses = [
  "WATCHING",
  "READING",
  "COMPLETED",
  "PLAN_TO_WATCH",
  "PLAN_TO_READ",
  "DROPPED",
  "ON_HOLD",
];
const loadingMedia = ref(true);

const userPosts = ref<Post[]>([]);
const loadingPosts = ref(false);
const postsPage = ref(0);
const hasMorePosts = ref(true);
const selectedPost = ref<Post | null>(null);

const currentMediaList = computed(() =>
  activeTab.value === "anime" ? animeList.value : mangaList.value,
);

const getMediaByStatus = (status: string) => {
  return currentMediaList.value.filter((m) => m.status === status);
};

const formatStatus = (status: string) => {
  return status.replace(/_/g, " ").toLowerCase();
};

const startEditing = () => {
  newAvatarUrl.value = profile.value?.avatar_url || "";
  isEditing.value = true;
};

const cancelEditing = () => {
  isEditing.value = false;
  newAvatarUrl.value = "";
};

const saveAvatar = async () => {
  if (!newAvatarUrl.value.trim()) return;
  avatarLoading.value = true;
  try {
    await updateAvatar(newAvatarUrl.value);
    isEditing.value = false;
  } catch (error) {
    console.error(error);
  } finally {
    avatarLoading.value = false;
  }
};

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

const goToMedia = (id: number, type: string) => {
  if (type === "ANIME") {
    router.push({ name: "AnimeDetail", params: { id } });
  } else if (type === "MANGA") {
    router.push({ name: "MangaDetail", params: { id } });
  }
};

const loadInitialData = async () => {
  if (loaderRef.value) loaderRef.value.showLoader();
  try {
    await Promise.all([fetchLists(), fetchMediaLists(), fetchUserPosts(true)]);
  } catch (error) {
    console.error(error);
  } finally {
    if (loaderRef.value) loaderRef.value.hideLoader();
  }
};

onMounted(() => {
  loadInitialData();
  window.addEventListener("scroll", handlePostsScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handlePostsScroll);
});
</script>
