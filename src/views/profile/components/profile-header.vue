<template>
  <div
    class="bg-white rounded-2xl shadow-sm p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 animate-fade-in"
  >
    <div class="relative group">
      <div
        class="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gray-200 flex items-center justify-center text-2xl md:text-3xl font-light text-gray-500 shrink-0 overflow-hidden"
      >
        <img
          v-if="profile?.avatar_url"
          :src="profile.avatar_url"
          alt="Avatar"
          class="w-full h-full object-cover"
        />
        <span v-else>
          {{ user?.email?.charAt(0).toUpperCase() }}
        </span>
      </div>
      <button
        @click="startEditing"
        class="absolute bottom-0 right-0 bg-gray-900 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-gray-800 cursor-pointer"
        title="Change Avatar"
      >
        <Edit2Icon class="w-3 h-3 md:w-4 md:h-4" />
      </button>
    </div>

    <div class="flex-1 text-center md:text-left w-full">
      <div v-if="isEditing" class="flex flex-col gap-2 max-w-md">
        <input
          v-model="newAvatarUrl"
          type="text"
          placeholder="Image URL"
          class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400"
          @keyup.enter="saveAvatar"
        />
        <div class="flex gap-2 justify-center md:justify-start">
          <button
            @click="saveAvatar"
            class="px-3 py-1 bg-gray-900 text-white text-xs rounded-md hover:bg-gray-800 cursor-pointer"
            :disabled="loading"
          >
            {{ loading ? "Saving..." : "Save" }}
          </button>
          <button
            @click="cancelEditing"
            class="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-md hover:bg-gray-200 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
      <div v-else>
        <h2 class="text-xl md:text-2xl font-light text-gray-900">
          {{ profile?.username || "User" }}
        </h2>
        <p class="text-sm md:text-base text-gray-500">{{ user?.email }}</p>
      </div>
    </div>

    <button
      @click="$emit('sign-out')"
      class="w-full md:w-auto px-6 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-red-500 transition-colors cursor-pointer"
    >
      Sign Out
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Edit2 as Edit2Icon } from "lucide-vue-next";
import type { User } from "@supabase/supabase-js";
import type { Profile } from "@/stores/auth";
import { useAuth } from "@/composables/useAuth";

const props = defineProps<{
  user: User | null;
  profile: Profile | null;
}>();

defineEmits<{
  (e: "sign-out"): void;
}>();

const { updateAvatar } = useAuth();
const isEditing = ref(false);
const newAvatarUrl = ref("");
const loading = ref(false);

const startEditing = () => {
  newAvatarUrl.value = props.profile?.avatar_url || "";
  isEditing.value = true;
};

const cancelEditing = () => {
  isEditing.value = false;
  newAvatarUrl.value = "";
};

const saveAvatar = async () => {
  if (!newAvatarUrl.value.trim()) return;
  loading.value = true;
  try {
    await updateAvatar(newAvatarUrl.value);
    isEditing.value = false;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};
</script>
