<template>
  <div>
    <h3 class="text-xl font-medium text-gray-900 mb-6">Characters</h3>
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      <div
        v-for="char in characters"
        :key="char.node.id"
        class="group relative rounded-xl overflow-hidden bg-gray-50"
      >
        <div class="aspect-3/4 overflow-hidden">
          <img
            :src="char.node.image.large"
            :alt="char.node.name.full"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
        <div
          class="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4"
        >
          <p class="text-white font-medium text-sm line-clamp-1">{{ char.node.name.full }}</p>
          <p class="text-gray-300 text-xs">{{ char.role }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Manga } from "@/services/anilist-manga";

defineProps<{
  characters: NonNullable<Manga["characters"]>["edges"];
}>();
</script>
