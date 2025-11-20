<template>
  <div>
    <h3 class="text-xl font-medium text-gray-900 mb-6">Related</h3>
    <div class="flex flex-wrap gap-4">
      <router-link
        v-for="relation in relations"
        :key="relation.node.id"
        :to="`/${relation.node.type?.toLowerCase() || 'manga'}/${relation.node.id}`"
        class="flex items-center gap-4 bg-gray-50 border border-gray-100 rounded-xl p-2 pr-6 hover:bg-white hover:shadow-md transition-all group"
      >
        <div class="w-12 h-16 rounded-lg overflow-hidden shrink-0">
          <img
            :src="relation.node.coverImage.medium"
            :alt="relation.node.title.romaji"
            class="w-full h-full object-cover"
          />
        </div>
        <div class="flex flex-col">
          <span class="text-xs text-gray-500 font-light uppercase tracking-wider mb-0.5">
            {{ formatRelationType(relation.relationType) }}
          </span>
          <span
            class="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1"
          >
            {{ relation.node.title.romaji }}
          </span>
          <span class="text-xs text-gray-400">
            {{ relation.node.type }}
          </span>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Manga } from "@/services/anilist-manga";

defineProps<{
  relations: NonNullable<Manga["relations"]>["edges"];
}>();

const formatRelationType = (type: string) => {
  return type.replace(/_/g, " ");
};
</script>
