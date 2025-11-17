<template>
  <div class="min-h-screen w-full bg-[#fefcff] relative">
    <div class="absolute inset-0 z-0" :style="gradientStyle"></div>
    <div class="relative z-10 w-full h-full">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const gradientStyle = computed(() => ({
  backgroundImage:
    "radial-gradient(circle at 30% 70%, rgba(173, 216, 230, 0.35), transparent 60%), radial-gradient(circle at 70% 30%, rgba(255, 182, 193, 0.4), transparent 60%)",
}));
</script>
