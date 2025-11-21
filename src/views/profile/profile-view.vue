<template>
  <div class="min-h-screen py-12 px-4">
    <div class="max-w-5xl mx-auto space-y-8">
      <div class="bg-white rounded-2xl shadow-sm p-8 flex items-center gap-6 animate-fade-in">
        <div
          class="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-light text-gray-500"
        >
          {{ user?.email?.charAt(0).toUpperCase() }}
        </div>
        <div class="flex-1">
          <h2 class="text-2xl font-light text-gray-900">{{ profile?.username || "User" }}</h2>
          <p class="text-gray-500">{{ user?.email }}</p>
        </div>
        <button
          @click="handleSignOut"
          class="px-6 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-red-500 transition-colors"
        >
          Sign Out
        </button>
      </div>

      <div
        class="flex gap-6 border-b border-gray-200 animate-fade-in"
        style="animation-delay: 0.05s"
      >
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          class="pb-4 text-sm font-medium transition-colors relative"
          :class="activeTab === tab.id ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'"
        >
          {{ tab.label }}
          <div
            v-if="activeTab === tab.id"
            class="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 rounded-t-full"
          ></div>
        </button>
      </div>

      <div
        v-if="activeTab === 'overview'"
        class="space-y-6 animate-fade-in"
        style="animation-delay: 0.1s"
      >
        <div class="flex items-center justify-between">
          <h3 class="text-xl font-light text-gray-900">My Lists</h3>
          <button
            @click="showCreateListModal = true"
            class="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800 transition-colors"
          >
            Create List
          </button>
        </div>

        <div v-if="loadingLists" class="flex justify-center py-12">
          <div
            class="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"
          ></div>
        </div>

        <div
          v-else-if="lists.length === 0"
          class="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300"
        >
          <p class="text-gray-500">No lists created yet</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="list in lists"
            :key="list.id"
            @click="openListDetails(list)"
            class="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer group relative"
          >
            <div class="flex justify-between items-start mb-4">
              <h4 class="text-lg font-medium text-gray-900">{{ list.name }}</h4>
              <button
                @click.stop="deleteList(list.id)"
                class="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2Icon class="w-4 h-4" />
              </button>
            </div>
            <p class="text-sm text-gray-500 line-clamp-2">
              {{ list.description || "No description" }}
            </p>
            <div class="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
              <span class="text-xs text-gray-400">{{
                new Date(list.created_at).toLocaleDateString()
              }}</span>
              <span class="text-xs font-medium text-gray-900">View Items →</span>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="space-y-8 animate-fade-in" style="animation-delay: 0.1s">
        <div v-for="status in mediaStatuses" :key="status" class="space-y-4">
          <h3 class="text-lg font-medium text-gray-900 capitalize">{{ formatStatus(status) }}</h3>
          <div
            v-if="loadingMedia"
            class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
          >
            <div v-for="n in 5" :key="n" class="bg-gray-200 rounded-xl h-48 animate-pulse"></div>
          </div>
          <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <div
              v-for="item in getMediaByStatus(
                activeTab === 'anime' ? animeList : mangaList,
                status
              )"
              :key="item.id"
              @click="
                goToMedia(
                  (item as any).anime_id || (item as any).manga_id,
                  activeTab === 'anime' ? 'ANIME' : 'MANGA'
                )
              "
              class="group relative aspect-2/3 bg-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <img
                v-if="item.media_cover"
                :src="item.media_cover"
                :alt="item.media_title"
                class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                No Cover
              </div>
              <div
                class="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4"
              >
                <h4 class="text-white text-sm font-medium line-clamp-2">{{ item.media_title }}</h4>
                <div class="flex items-center gap-2 mt-2">
                  <span class="text-xs text-gray-300">{{
                    item.score ? item.score + "/10" : "-"
                  }}</span>
                </div>
              </div>
            </div>
          </div>
          <div
            v-if="
              !loadingMedia &&
              getMediaByStatus(activeTab === 'anime' ? animeList : mangaList, status).length === 0
            "
            class="text-sm text-gray-400 italic"
          >
            No items in this category
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="showCreateListModal"
      class="fixed inset-0 z-50 flex items-center justify-center px-4"
    >
      <div
        class="absolute inset-0 bg-black/50 backdrop-blur-sm"
        @click="showCreateListModal = false"
      ></div>
      <div class="bg-white rounded-2xl w-full max-w-md p-6 relative z-10 animate-scale-in">
        <h3 class="text-xl font-medium text-gray-900 mb-6">Create New List</h3>
        <form @submit.prevent="createList" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              v-model="newListName"
              type="text"
              required
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
              placeholder="My Favorites"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              v-model="newListDesc"
              rows="3"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
              placeholder="A collection of..."
            ></textarea>
          </div>
          <div class="flex justify-end gap-3 mt-6">
            <button
              type="button"
              @click="showCreateListModal = false"
              class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="creatingList"
              class="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {{ creatingList ? "Creating..." : "Create" }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <div
      v-if="showListDetailsModal"
      class="fixed inset-0 z-50 flex items-center justify-center px-4"
    >
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closeListDetails"></div>
      <div
        class="bg-white rounded-2xl w-full max-w-4xl h-[80vh] flex flex-col relative z-10 animate-scale-in overflow-hidden"
      >
        <div class="p-6 border-b border-gray-100 flex justify-between items-start">
          <div>
            <h3 class="text-2xl font-light text-gray-900">{{ selectedList?.name }}</h3>
            <p class="text-gray-500 mt-1">{{ selectedList?.description }}</p>
          </div>
          <button @click="closeListDetails" class="text-gray-400 hover:text-gray-600">
            <XIcon class="w-6 h-6" />
          </button>
        </div>

        <div class="flex-1 overflow-y-auto p-6">
          <div v-if="loadingListItems" class="flex justify-center py-12">
            <div
              class="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"
            ></div>
          </div>

          <div v-else-if="selectedListItems.length === 0" class="text-center py-12">
            <p class="text-gray-500">This list is empty</p>
          </div>

          <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <div
              v-for="item in selectedListItems"
              :key="item.id"
              @click="goToMedia(item.media_id, item.media_type)"
              class="group relative aspect-2/3 bg-gray-100 rounded-xl overflow-hidden shadow-sm cursor-pointer"
            >
              <img
                v-if="item.media_cover"
                :src="item.media_cover"
                :alt="item.media_title"
                class="w-full h-full object-cover"
              />
              <div
                class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center gap-3"
              >
                <h4 class="text-white text-sm font-medium line-clamp-2">{{ item.media_title }}</h4>
                <button
                  @click.stop="removeListItem(item)"
                  class="px-3 py-1 bg-red-500 text-white text-xs rounded-full hover:bg-red-600 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth";
import {
  userListService,
  type CustomList,
  type ListItem,
  type MediaStatus,
} from "@/services/user-lists";
import { Trash2 as Trash2Icon, X as XIcon } from "lucide-vue-next";

const { user, profile, signOut } = useAuth();
const router = useRouter();

const activeTab = ref("overview");
const tabs = [
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
const getMediaByStatus = (list: MediaStatus[], status: string) => {
  return list.filter((item) => item.status && item.status.toUpperCase() === status);
};

const formatStatus = (status: string) => {
  return status
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
};

onMounted(() => {
  fetchLists();
  fetchMediaLists();
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
