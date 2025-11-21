<template>
  <div class="flex items-center gap-4">
    <div class="relative" ref="statusDropdownRef">
      <button
        @click="toggleStatusDropdown"
        class="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all"
      >
        <span>{{ currentStatusLabel }}</span>
        <ChevronDownIcon class="w-4 h-4" />
      </button>

      <div
        v-if="showStatusDropdown"
        class="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-scale-in"
      >
        <button
          v-for="status in statusOptions"
          :key="status.value || 'default'"
          @click="updateStatus(status.value)"
          class="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-between"
          :class="{ 'bg-gray-50 font-medium': currentStatus === status.value }"
        >
          {{ status.label }}
          <CheckIcon v-if="currentStatus === status.value" class="w-4 h-4 text-gray-900" />
        </button>
      </div>
    </div>

    <button
      @click="openListsModal"
      class="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 hover:border-red-200 hover:text-red-500 transition-all group"
      :class="{ 'text-red-500 border-red-200 bg-red-50': isInAnyList }"
    >
      <HeartIcon class="w-6 h-6" :class="{ 'fill-current': isInAnyList }" />
    </button>

    <Teleport to="body">
      <div v-if="showListsModal" class="fixed inset-0 z-60 flex items-center justify-center px-4">
        <div
          class="absolute inset-0 bg-black/50 backdrop-blur-sm"
          @click="showListsModal = false"
        ></div>
        <div class="bg-white rounded-2xl w-full max-w-md p-6 relative z-10 animate-scale-in">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-xl font-medium text-gray-900">Add to List</h3>
            <button @click="showListsModal = false" class="text-gray-400 hover:text-gray-600">
              <XIcon class="w-5 h-5" />
            </button>
          </div>

          <div v-if="loadingLists" class="flex justify-center py-8">
            <div
              class="w-6 h-6 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"
            ></div>
          </div>

          <div v-else-if="lists.length === 0" class="text-center py-8">
            <p class="text-gray-500 mb-4">You don't have any lists yet.</p>
            <router-link
              to="/profile"
              class="text-sm font-medium text-gray-900 underline hover:text-gray-700"
            >
              Create a list in your profile
            </router-link>
          </div>

          <div v-else class="space-y-2 max-h-[60vh] overflow-y-auto">
            <button
              v-for="list in lists"
              :key="list.id"
              @click="toggleList(list.id)"
              class="w-full flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-gray-300 hover:bg-gray-50 transition-all"
            >
              <span class="text-gray-900 font-medium">{{ list.name }}</span>
              <div
                class="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center transition-colors"
                :class="{ 'bg-gray-900 border-gray-900': isItemInList(list.id) }"
              >
                <CheckIcon v-if="isItemInList(list.id)" class="w-3 h-3 text-white" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth";
import { userListService, type CustomList } from "@/services/user-lists";
import {
  ChevronDown as ChevronDownIcon,
  Check as CheckIcon,
  Heart as HeartIcon,
  X as XIcon,
} from "lucide-vue-next";

const props = defineProps<{
  mediaId: number;
  mediaType: "ANIME" | "MANGA";
  mediaTitle: string;
  mediaCover: string;
}>();

const router = useRouter();
const { user } = useAuth();

const showStatusDropdown = ref(false);
const showListsModal = ref(false);
const statusDropdownRef = ref<HTMLElement | null>(null);
const currentStatus = ref<string | null>(null);
const lists = ref<CustomList[]>([]);
const listItems = ref<Record<number, boolean>>({});
const loadingLists = ref(false);

const animeStatusOptions = [
  { label: "Add to Library", value: null },
  { label: "Watching", value: "WATCHING" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Plan to Watch", value: "PLAN_TO_WATCH" },
  { label: "Dropped", value: "DROPPED" },
];

const mangaStatusOptions = [
  { label: "Add to Library", value: null },
  { label: "Reading", value: "READING" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Plan to Read", value: "PLAN_TO_READ" },
  { label: "Dropped", value: "DROPPED" },
];

const statusOptions = computed(() =>
  props.mediaType === "ANIME" ? animeStatusOptions : mangaStatusOptions
);

const currentStatusLabel = computed(() => {
  const option = statusOptions.value.find((o) => o.value === currentStatus.value);
  return option ? option.label : "Add to Library";
});

const isInAnyList = computed(() => Object.values(listItems.value).some((v) => v));

const toggleStatusDropdown = () => {
  if (!user.value) {
    router.push("/login");
    return;
  }
  showStatusDropdown.value = !showStatusDropdown.value;
};

const updateStatus = async (status: string | null) => {
  if (!user.value) return;

  try {
    if (status) {
      await userListService.updateStatus(
        props.mediaId,
        props.mediaType,
        status,
        undefined,
        props.mediaTitle,
        props.mediaCover
      );
    }
    currentStatus.value = status;
    showStatusDropdown.value = false;
  } catch (error) {
    console.error(error);
  }
};

const openListsModal = async () => {
  if (!user.value) {
    router.push("/login");
    return;
  }
  showListsModal.value = true;
  if (lists.value.length === 0) {
    await fetchListsAndStatus();
  }
};

const fetchListsAndStatus = async () => {
  loadingLists.value = true;
  try {
    lists.value = await userListService.getCustomLists();

    const checks: Record<number, boolean> = {};
    for (const list of lists.value) {
      const items = await userListService.getListItems(list.id);
      checks[list.id] = items.some(
        (item) => item.media_id === props.mediaId && item.media_type === props.mediaType
      );
    }
    listItems.value = checks;
  } catch (error) {
    console.error(error);
  } finally {
    loadingLists.value = false;
  }
};

const toggleList = async (listId: number) => {
  const isAdded = listItems.value[listId];
  try {
    if (isAdded) {
      await userListService.removeFromList(listId, props.mediaId, props.mediaType);
      listItems.value[listId] = false;
    } else {
      await userListService.addToList(listId, {
        id: props.mediaId,
        type: props.mediaType,
        title: props.mediaTitle,
        cover: props.mediaCover,
      });
      listItems.value[listId] = true;
    }
  } catch (error) {
    console.error(error);
  }
};

const isItemInList = (listId: number) => !!listItems.value[listId];

const handleClickOutside = (event: MouseEvent) => {
  if (statusDropdownRef.value && !statusDropdownRef.value.contains(event.target as Node)) {
    showStatusDropdown.value = false;
  }
};

watch(
  () => props.mediaId,
  async (newId) => {
    if (newId && user.value) {
      currentStatus.value = null;
      listItems.value = {};
      try {
        const statusData = await userListService.getStatus(props.mediaId, props.mediaType);
        if (statusData) {
          currentStatus.value = statusData.status;
        }
        await fetchListsAndStatus();
      } catch (error) {
        console.error(error);
      }
    }
  }
);

onMounted(async () => {
  document.addEventListener("click", handleClickOutside);
  if (user.value) {
    try {
      const statusData = await userListService.getStatus(props.mediaId, props.mediaType);
      if (statusData) {
        currentStatus.value = statusData.status;
      }
      await fetchListsAndStatus();
    } catch (error) {
      console.error(error);
    }
  }
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
.animate-scale-in {
  animation: scaleIn 0.2s ease-out;
  transform-origin: top left;
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
