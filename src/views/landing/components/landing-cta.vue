<template>
  <div class="flex flex-col items-center gap-6 text-center px-8">
    <h2 class="cta-title text-4xl md:text-5xl font-light text-gray-900 tracking-tight m-0">
      Ready to start?
    </h2>
    <p class="cta-description text-base md:text-lg font-light text-gray-500 tracking-wide m-0">
      Begin your anime journey today
    </p>
    <router-link
      to="/home"
      class="cta-button inline-flex items-center gap-3 mt-4 px-8 py-3.5 md:px-10 md:py-4 bg-gray-900 text-white no-underline rounded-lg transition-all duration-300 hover:bg-gray-800 hover:-translate-y-0.5 hover:shadow-xl group"
    >
      <span class="text-base font-normal tracking-wide">Get Started</span>
      <span class="text-xl transition-transform duration-300 group-hover:translate-x-1">→</span>
    </router-link>
  </div>
</template>

<script setup lang="ts"></script>
