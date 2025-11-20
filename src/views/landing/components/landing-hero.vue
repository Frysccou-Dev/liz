<template>
  <div class="hero-content">
    <h1 class="hero-title">
      <span class="letter">L</span>
      <span class="letter">I</span>
      <span class="letter">Z</span>
    </h1>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.hero-content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-title {
  font-weight: 500;
  color: rgb(209 213 219);
  font-size: 70vh;
  margin: 0;
  line-height: 0.7;
  user-select: none;
  will-change: transform, opacity;
  display: flex;
  gap: 0;
}

.letter {
  display: inline-block;
  will-change: transform, opacity;
}
</style>
