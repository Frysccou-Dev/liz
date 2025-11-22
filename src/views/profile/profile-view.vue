<template>
  <div class="min-h-screen py-12 px-4">
    <div class="max-w-5xl mx-auto space-y-8">
      <ProfileHeader :user="user" :profile="profile" @sign-out="handleSignOut" />

      <ProfileTabs v-model:activeTab="activeTab" :tabs="tabs" />

      <ProfileOverview
        v-if="activeTab === 'overview'"
        :lists="lists"
        :loading="loadingLists"
        @create-list="showCreateListModal = true"
        @open-list="openListDetails"
        @delete-list="deleteList"
      />

      <ProfileMediaList
        v-else
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

import ProfileHeader from "./components/profile-header.vue";
import ProfileTabs from "./components/profile-tabs.vue";
import ProfileOverview from "./components/profile-overview.vue";
import ProfileMediaList from "./components/profile-media-list.vue";
import CreateListModal from "./components/create-list-modal.vue";
import ListDetailsModal from "./components/list-details-modal.vue";

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
