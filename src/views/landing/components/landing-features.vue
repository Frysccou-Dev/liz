<template>
  <div class="flex flex-col items-center justify-center gap-12">
    <p class="text-lg text-gray-500 text-center max-w-xl font-light tracking-wide">
      Descubre y explora tus animes favoritos.
    </p>
    <router-link to="/home" class="group">
      <span
        class="text-sm text-black tracking-widest uppercase border-b border-black pb-2 group-hover:opacity-60 transition-opacity duration-200 inline-block"
      >
        Ver animes
      </span>
    </router-link>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
