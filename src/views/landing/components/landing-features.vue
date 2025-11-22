<template>
  <div class="flex flex-col items-center justify-center gap-8 lg:gap-12">
    <p
      class="text-lg text-gray-500 text-center max-w-xl font-light tracking-wide flex flex-wrap justify-center gap-0"
    >
      <span
        v-for="(char, index) in textChars"
        :key="index"
        class="char inline-block will-change-transform"
        >{{ char === " " ? "\u00A0" : char }}</span
      >
    </p>
    <router-link to="/home" class="inline-block group">
      <span
        class="flex text-sm text-black tracking-widest uppercase border-b border-black pb-2 transition-opacity group-hover:opacity-60"
      >
        <span
          v-for="(char, index) in linkChars"
          :key="index"
          class="char inline-block will-change-transform"
          >{{ char === " " ? "\u00A0" : char }}</span
        >
      </span>
    </router-link>
  </div>
</template>

<script setup lang="ts">
const text = "Discover and explore your favorite anime.";
const linkText = "Browse anime";

const textChars = text.split("");
const linkChars = linkText.split("");
</script>
