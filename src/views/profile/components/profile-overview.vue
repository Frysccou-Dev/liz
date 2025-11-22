<template>
  <div class="space-y-6 animate-fade-in" style="animation-delay: 0.1s">
    <div class="flex items-center justify-between">
      <h3 class="text-xl font-light text-gray-900">My Lists</h3>
      <button
        @click="$emit('create-list')"
        class="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800 transition-colors"
      >
        Create List
      </button>
    </div>

    <div v-if="loading" class="flex justify-center py-12">
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
        @click="$emit('open-list', list)"
        class="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer group relative"
      >
        <div class="flex justify-between items-start mb-4">
          <h4 class="text-lg font-medium text-gray-900">{{ list.name }}</h4>
          <button
            @click.stop="$emit('delete-list', list.id)"
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
</template>

<script setup lang="ts">
import { Trash2 as Trash2Icon } from "lucide-vue-next";
import type { CustomList } from "@/services/user-lists";

defineProps<{
  lists: CustomList[];
  loading: boolean;
}>();

defineEmits<{
  (e: "create-list"): void;
  (e: "open-list", list: CustomList): void;
  (e: "delete-list", id: number): void;
}>();
</script>
