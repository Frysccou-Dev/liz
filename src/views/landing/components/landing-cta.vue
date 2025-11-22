<template>
  <div class="flex flex-col items-center gap-4 lg:gap-6 text-center px-4 md:px-6 lg:px-8">
    <h2
      class="cta-title text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 tracking-tight m-0"
    >
      Ready to start?
    </h2>
    <p
      class="cta-description text-sm md:text-base lg:text-lg font-light text-gray-500 tracking-wide m-0"
    >
      Begin your anime journey today
    </p>
    <router-link
      to="/home"
      class="cta-button inline-flex items-center gap-3 mt-4 px-6 py-3 md:px-8 md:py-3.5 lg:px-10 lg:py-4 bg-gray-900 text-white no-underline rounded-lg transition-all duration-300 hover:bg-gray-800 hover:-translate-y-0.5 hover:shadow-xl group"
    >
      <span class="text-sm md:text-base font-normal tracking-wide">Get Started</span>
      <span class="text-lg md:text-xl transition-transform duration-300 group-hover:translate-x-1"
        >→</span
      >
    </router-link>
  </div>
</template>

<script setup lang="ts"></script>
