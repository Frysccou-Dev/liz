<template>
  <div class="features-content">
    <p class="features-text">
      <span v-for="(char, index) in textChars" :key="index" class="char">{{
        char === " " ? "\u00A0" : char
      }}</span>
    </p>
    <router-link to="/home" class="features-link">
      <span class="features-link-wrapper">
        <span v-for="(char, index) in linkChars" :key="index" class="char">{{
          char === " " ? "\u00A0" : char
        }}</span>
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

<style scoped>
.features-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3rem;
}

.features-text {
  font-size: 1.125rem;
  color: rgb(107 114 128);
  text-align: center;
  max-width: 36rem;
  font-weight: 300;
  letter-spacing: 0.025em;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0;
}

.char {
  display: inline-block;
  will-change: transform, opacity;
}

.features-link {
  display: inline-block;
}

.features-link-wrapper {
  display: flex;
  font-size: 0.875rem;
  color: black;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  border-bottom: 1px solid black;
  padding-bottom: 0.5rem;
  transition: opacity 0.2s;
}

.features-link:hover .features-link-wrapper {
  opacity: 0.6;
}
</style>
