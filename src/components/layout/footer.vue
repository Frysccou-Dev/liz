<template>
  <footer class="bg-white border-t border-gray-100">
    <div class="max-w-7xl mx-auto px-6 md:px-12">
      <div class="py-16 grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
        <div class="md:col-span-2">
          <router-link to="/" class="text-2xl font-light tracking-widest text-gray-900 mb-4 block">
            liz
          </router-link>
          <p class="text-gray-500 font-light max-w-sm leading-relaxed">
            A minimalist platform to discover, organize and explore the world of anime and manga.
          </p>
        </div>

        <div>
          <h4 class="text-xs uppercase tracking-[0.2em] text-gray-400 mb-6">Explore</h4>
          <ul class="space-y-4">
            <li>
              <router-link
                to="/home"
                class="text-gray-600 hover:text-gray-900 font-light transition-colors"
              >
                Animes
              </router-link>
            </li>
            <li>
              <router-link
                to="/manga"
                class="text-gray-600 hover:text-gray-900 font-light transition-colors"
              >
                Mangas
              </router-link>
            </li>
            <li>
              <router-link
                to="/social"
                class="text-gray-600 hover:text-gray-900 font-light transition-colors"
              >
                Community
              </router-link>
            </li>
          </ul>
        </div>

        <div>
          <h4 class="text-xs uppercase tracking-[0.2em] text-gray-400 mb-6">Account</h4>
          <ul class="space-y-4">
            <li>
              <router-link
                to="/login"
                class="text-gray-600 hover:text-gray-900 font-light transition-colors"
              >
                Login
              </router-link>
            </li>
            <li>
              <router-link
                to="/register"
                class="text-gray-600 hover:text-gray-900 font-light transition-colors"
              >
                Register
              </router-link>
            </li>
            <li>
              <router-link
                to="/profile"
                class="text-gray-600 hover:text-gray-900 font-light transition-colors"
              >
                Profile
              </router-link>
            </li>
          </ul>
        </div>
      </div>

      <div
        class="py-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6"
      >
        <div class="flex items-center gap-6">
          <a
            v-for="social in socials"
            :key="social.label"
            :href="social.href"
            target="_blank"
            rel="noopener noreferrer"
            class="text-gray-400 hover:text-gray-900 transition-colors duration-300"
            :aria-label="social.label"
          >
            <component :is="social.icon" class="w-5 h-5" />
          </a>
        </div>

        <div class="flex items-center gap-2 text-sm text-gray-400">
          <span>Made with</span>
          <HeartIcon class="w-4 h-4 text-gray-900" />
          <span>by</span>
          <a
            href="https://www.linkedin.com/in/espindola-francisco"
            target="_blank"
            rel="noopener noreferrer"
            class="text-gray-900 hover:underline"
          >
            Frysccou
          </a>
        </div>

        <p class="text-sm text-gray-400">© 2026 liz</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { Heart as HeartIcon, Youtube, Music, Instagram, Linkedin, Mail } from "lucide-vue-next";

const socials = [
  { label: "YouTube", href: "https://www.youtube.com/@frysccouu", icon: Youtube },
  {
    label: "Music",
    href: "https://music.youtube.com/playlist?list=PLr8nCm0aobtRA0SAeeK4Fa9tbWf-r-ton",
    icon: Music,
  },
  { label: "Instagram", href: "https://www.instagram.com/frysccou", icon: Instagram },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/espindola-francisco", icon: Linkedin },
  { label: "Email", href: "mailto:franespindola71@gmail.com", icon: Mail },
];
</script>
