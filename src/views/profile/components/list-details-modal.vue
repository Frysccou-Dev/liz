<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center px-4">
    <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="$emit('close')"></div>
    <div
      class="bg-white rounded-2xl w-full max-w-4xl h-[80vh] flex flex-col relative z-10 animate-scale-in overflow-hidden"
    >
      <div class="p-6 border-b border-gray-100 flex justify-between items-start">
        <div>
          <h3 class="text-2xl font-light text-gray-900">{{ list?.name }}</h3>
          <p class="text-gray-500 mt-1">{{ list?.description }}</p>
        </div>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
          <XIcon class="w-6 h-6" />
        </button>
      </div>

      <div class="flex-1 overflow-y-auto p-6">
        <div v-if="loading" class="flex justify-center py-12">
          <div
            class="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"
          ></div>
        </div>

        <div v-else-if="items.length === 0" class="text-center py-12">
          <p class="text-gray-500">This list is empty</p>
        </div>

        <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <div
            v-for="item in items"
            :key="item.id"
            @click="$emit('go-to-media', item.media_id, item.media_type)"
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
                @click.stop="$emit('remove-item', item)"
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
</template>

<script setup lang="ts">
import { X as XIcon } from "lucide-vue-next";
import type { CustomList, ListItem } from "@/services/user-lists";

defineProps<{
  list: CustomList | null;
  items: ListItem[];
  loading: boolean;
}>();

defineEmits<{
  (e: "close"): void;
  (e: "go-to-media", id: number, type: string): void;
  (e: "remove-item", item: ListItem): void;
}>();
</script>
