<template>
  <div class="min-h-screen py-12 px-4">
    <div class="max-w-5xl mx-auto space-y-12">
      <!-- Profile Header -->
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

      <!-- Custom Lists Section -->
      <div class="space-y-6 animate-fade-in" style="animation-delay: 0.1s">
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
    </div>

    <!-- Create List Modal -->
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useAuth } from "@/composables/useAuth";
import { userListService, type CustomList } from "@/services/user-lists";
import { Trash2 as Trash2Icon } from "lucide-vue-next";

const { user, profile, signOut } = useAuth();
const lists = ref<CustomList[]>([]);
const loadingLists = ref(true);
const showCreateListModal = ref(false);
const newListName = ref("");
const newListDesc = ref("");
const creatingList = ref(false);

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

const createList = async () => {
  creatingList.value = true;
  try {
    const newList = await userListService.createCustomList(newListName.value, newListDesc.value);
    lists.value.unshift(newList);
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

onMounted(() => {
  fetchLists();
});
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
