<template>
  <img src="@/assets/footer.svg" class="w-full" />
  <footer class="h-[30dvh] bg-gray-50 flex flex-col items-center justify-center gap-16 px-4">
    <div class="flex items-center gap-2 text-sm text-gray-700">
      <span>Made with love</span>
      <Heart class="h-4 w-4 fill-black text-black" />
      <span>by Frysccou</span>
    </div>

    <div class="flex flex-wrap items-center justify-center gap-8">
      <a
        href="https://www.youtube.com/@frysccouu"
        target="_blank"
        rel="noopener noreferrer"
        class="group flex flex-col items-center gap-2 text-gray-700 hover:text-black transition-colors duration-300"
      >
        <Youtube class="h-5 w-5" />
        <span
          class="text-xs tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0"
        >
          YouTube
        </span>
      </a>

      <a
        href="https://music.youtube.com/playlist?list=PLr8nCm0aobtRA0SAeeK4Fa9tbWf-r-ton"
        target="_blank"
        rel="noopener noreferrer"
        class="group flex flex-col items-center gap-2 text-gray-700 hover:text-black transition-colors duration-300"
      >
        <Music class="h-5 w-5" />
        <span
          class="text-xs tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0"
        >
          Playlist
        </span>
      </a>

      <a
        href="https://www.instagram.com/frysccou"
        target="_blank"
        rel="noopener noreferrer"
        class="group flex flex-col items-center gap-2 text-gray-700 hover:text-black transition-colors duration-300"
      >
        <Instagram class="h-5 w-5" />
        <span
          class="text-xs tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0"
        >
          Instagram
        </span>
      </a>

      <a
        href="https://www.linkedin.com/in/espindola-francisco"
        target="_blank"
        rel="noopener noreferrer"
        class="group flex flex-col items-center gap-2 text-gray-700 hover:text-black transition-colors duration-300"
      >
        <Linkedin class="h-5 w-5" />
        <span
          class="text-xs tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0"
        >
          LinkedIn
        </span>
      </a>

      <a
        href="mailto:franespindola71@gmail.com"
        class="group flex flex-col items-center gap-2 text-gray-700 hover:text-black transition-colors duration-300"
      >
        <Mail class="h-5 w-5" />
        <span
          class="text-xs tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0"
        >
          Email
        </span>
      </a>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { Heart, Youtube, Music, Instagram, Linkedin, Mail } from "lucide-vue-next";
</script>

<style scoped></style>
