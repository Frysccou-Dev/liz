<template>
  <div
    class="relative px-2 mb-6 w-40 transition-transform duration-300 transform hover:z-10 sm:mb-0 flex flex-col"
  >
    <div class="overflow-hidden relative w-40 h-60 group card-glass-effect">
      <img
        v-if="anime?.coverImage?.extraLarge"
        :src="anime.coverImage.extraLarge"
        :alt="anime.title?.romaji || 'Anime'"
        class="w-full h-full object-cover"
      />
      <div v-else class="relative w-full h-full bg-linear-to-br from-gray-800 to-gray-900"></div>
    </div>
    <p class="mt-3 text-sm font-light text-gray-900 text-center line-clamp-2">
      {{ anime?.title?.romaji || anime?.title?.english || "Sin nombre" }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Anime {
  id: number;
  title?: {
    romaji?: string;
    english?: string;
    native?: string;
  };
  coverImage?: {
    extraLarge?: string;
    large?: string;
    medium?: string;
  };
}

defineProps<{
  anime?: Anime;
}>();
</script>

<style scoped>
.card-glass-effect {
  border-radius: 8px;
  transform: perspective(1200px) rotateY(-20deg) rotateX(2deg);
  transition: transform 0.5s ease;
  overflow: hidden;
}

.card-glass-effect:hover {
  transform: perspective(1200px) rotateY(0deg) rotateX(0deg) translateZ(20px);
}

@media (max-width: 640px) {
  .card-glass-effect {
    transform: none;
    border-radius: 8px;
  }

  .card-glass-effect:hover {
    transform: none;
  }
}
</style>
