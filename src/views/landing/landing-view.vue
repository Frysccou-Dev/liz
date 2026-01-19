<template>
  <div class="min-h-screen bg-white">
    <section
      class="min-h-screen flex flex-col items-center justify-center px-6 py-20 relative overflow-hidden"
    >
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute top-1/4 left-1/4 w-px h-64 bg-gray-100"></div>
        <div class="absolute top-1/3 right-1/4 w-px h-48 bg-gray-100"></div>
        <div class="absolute bottom-1/4 left-1/3 w-96 h-px bg-gray-100"></div>
        <div class="absolute top-1/2 right-1/3 w-64 h-px bg-gray-100"></div>
      </div>

      <div class="text-center max-w-4xl relative z-10">
        <h1
          class="text-[20vw] md:text-[15vw] lg:text-[12vw] font-light text-gray-200 leading-none tracking-tight select-none mb-12"
        >
          liz
        </h1>

        <p
          class="text-xl md:text-2xl lg:text-3xl text-gray-600 font-light max-w-2xl mx-auto leading-relaxed mb-16"
        >
          Your gateway to discover, organize and explore the world of anime and manga.
        </p>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <router-link
            to="/home"
            class="px-10 py-4 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-all duration-300 hover:-translate-y-0.5"
          >
            Explore Catalog
          </router-link>
          <router-link
            to="/register"
            class="px-10 py-4 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:border-gray-900 hover:text-gray-900 transition-all duration-300"
          >
            Create Account
          </router-link>
        </div>
      </div>

      <div
        class="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-gray-400"
      >
        <div class="w-px h-12 bg-gray-200"></div>
        <span class="text-xs uppercase tracking-[0.3em]">scroll</span>
      </div>
    </section>

    <section class="py-32 px-6">
      <div class="max-w-4xl mx-auto text-center">
        <span class="text-xs uppercase tracking-[0.3em] text-gray-400 mb-6 block">About</span>
        <p class="text-2xl md:text-3xl lg:text-4xl text-gray-900 font-light leading-relaxed">
          A minimalist platform designed for those who love anime and manga.
          <span class="text-gray-400">Clean, simple, and focused on what matters.</span>
        </p>
      </div>
    </section>

    <section class="py-32 px-6 bg-gray-50">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-20">
          <span class="text-xs uppercase tracking-[0.3em] text-gray-400 mb-6 block">Features</span>
          <h2 class="text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 tracking-tight">
            Everything you need
          </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
          <div class="text-center group">
            <div
              class="w-20 h-20 mx-auto mb-8 rounded-2xl bg-white border border-gray-200 flex items-center justify-center group-hover:border-gray-400 transition-colors duration-500"
            >
              <SearchIcon
                class="w-8 h-8 text-gray-400 group-hover:text-gray-900 transition-colors duration-500"
              />
            </div>
            <h3 class="text-xl font-medium text-gray-900 mb-4">Search & Discover</h3>
            <p class="text-gray-500 font-light leading-relaxed">
              Advanced filters to find your next favorite title among thousands of anime and manga.
            </p>
          </div>

          <div class="text-center group">
            <div
              class="w-20 h-20 mx-auto mb-8 rounded-2xl bg-white border border-gray-200 flex items-center justify-center group-hover:border-gray-400 transition-colors duration-500"
            >
              <HeartIcon
                class="w-8 h-8 text-gray-400 group-hover:text-gray-900 transition-colors duration-500"
              />
            </div>
            <h3 class="text-xl font-medium text-gray-900 mb-4">Personal Lists</h3>
            <p class="text-gray-500 font-light leading-relaxed">
              Organize your library with custom lists and track your watching or reading progress.
            </p>
          </div>

          <div class="text-center group">
            <div
              class="w-20 h-20 mx-auto mb-8 rounded-2xl bg-white border border-gray-200 flex items-center justify-center group-hover:border-gray-400 transition-colors duration-500"
            >
              <UsersIcon
                class="w-8 h-8 text-gray-400 group-hover:text-gray-900 transition-colors duration-500"
              />
            </div>
            <h3 class="text-xl font-medium text-gray-900 mb-4">Community</h3>
            <p class="text-gray-500 font-light leading-relaxed">
              Share posts, follow other fans, and discover recommendations from the community.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="py-32 px-6">
      <div class="max-w-6xl mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div>
            <span class="text-xs uppercase tracking-[0.3em] text-gray-400 mb-6 block">Anime</span>
            <h2 class="text-3xl md:text-4xl font-light text-gray-900 mb-6">
              Explore thousands of anime titles
            </h2>
            <p class="text-gray-500 font-light leading-relaxed mb-8">
              From timeless classics to the latest releases. Filter by genre, season, year, and
              more. All data synced in real-time with AniList.
            </p>
            <router-link
              to="/home"
              class="inline-flex items-center gap-2 text-gray-900 font-medium hover:gap-4 transition-all duration-300"
            >
              Browse Anime
              <ArrowRightIcon class="w-4 h-4" />
            </router-link>
          </div>
          <div class="aspect-video bg-gray-100 rounded-2xl"></div>
        </div>
      </div>
    </section>

    <section class="py-32 px-6 bg-gray-50">
      <div class="max-w-6xl mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div class="order-2 lg:order-1 aspect-video bg-gray-200 rounded-2xl"></div>
          <div class="order-1 lg:order-2">
            <span class="text-xs uppercase tracking-[0.3em] text-gray-400 mb-6 block">Manga</span>
            <h2 class="text-3xl md:text-4xl font-light text-gray-900 mb-6">
              Your manga collection in one place
            </h2>
            <p class="text-gray-500 font-light leading-relaxed mb-8">
              Discover new series, track chapters, and never lose your reading progress. The same
              powerful features, tailored for manga readers.
            </p>
            <router-link
              to="/manga"
              class="inline-flex items-center gap-2 text-gray-900 font-medium hover:gap-4 transition-all duration-300"
            >
              Browse Manga
              <ArrowRightIcon class="w-4 h-4" />
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <section class="py-32 px-6">
      <div class="max-w-4xl mx-auto text-center">
        <span class="text-xs uppercase tracking-[0.3em] text-gray-400 mb-6 block">Numbers</span>
        <h2 class="text-3xl md:text-4xl font-light text-gray-900 mb-16">A growing library</h2>

        <div class="flex flex-wrap justify-center items-center gap-16 md:gap-24">
          <div>
            <div class="text-5xl md:text-6xl font-light text-gray-900">10K+</div>
            <div class="text-sm uppercase tracking-[0.2em] text-gray-400 mt-3">Anime Titles</div>
          </div>
          <div class="hidden md:block w-px h-16 bg-gray-200"></div>
          <div>
            <div class="text-5xl md:text-6xl font-light text-gray-900">50K+</div>
            <div class="text-sm uppercase tracking-[0.2em] text-gray-400 mt-3">Manga Titles</div>
          </div>
          <div class="hidden md:block w-px h-16 bg-gray-200"></div>
          <div>
            <div class="text-5xl md:text-6xl font-light text-gray-900">50+</div>
            <div class="text-sm uppercase tracking-[0.2em] text-gray-400 mt-3">Genres</div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-32 px-6 bg-gray-50">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-20">
          <span class="text-xs uppercase tracking-[0.3em] text-gray-400 mb-6 block"
            >How it works</span
          >
          <h2 class="text-3xl md:text-4xl font-light text-gray-900">Simple as it should be</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div class="text-center">
            <div class="text-6xl font-light text-gray-200 mb-6">01</div>
            <h3 class="text-xl font-medium text-gray-900 mb-4">Create an account</h3>
            <p class="text-gray-500 font-light">
              Sign up in seconds and start building your profile.
            </p>
          </div>
          <div class="text-center">
            <div class="text-6xl font-light text-gray-200 mb-6">02</div>
            <h3 class="text-xl font-medium text-gray-900 mb-4">Explore the catalog</h3>
            <p class="text-gray-500 font-light">
              Browse through our extensive library of anime and manga.
            </p>
          </div>
          <div class="text-center">
            <div class="text-6xl font-light text-gray-200 mb-6">03</div>
            <h3 class="text-xl font-medium text-gray-900 mb-4">Organize & Share</h3>
            <p class="text-gray-500 font-light">
              Create lists, track progress, and connect with the community.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="py-40 px-6 bg-gray-900">
      <div class="max-w-3xl mx-auto text-center">
        <h2 class="text-4xl md:text-5xl font-light text-white tracking-tight mb-8">
          Ready to start?
        </h2>
        <p class="text-xl text-gray-400 font-light mb-12 max-w-lg mx-auto">
          Join our community and start exploring the anime world today.
        </p>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <router-link
            to="/register"
            class="px-10 py-4 bg-white text-gray-900 text-sm font-medium rounded-lg hover:bg-gray-100 transition-all duration-300"
          >
            Get Started — It's Free
          </router-link>
          <router-link
            to="/home"
            class="px-10 py-4 border border-gray-600 text-gray-300 text-sm font-medium rounded-lg hover:border-white hover:text-white transition-all duration-300"
          >
            Browse without account
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import {
  Search as SearchIcon,
  Heart as HeartIcon,
  Users as UsersIcon,
  ArrowRight as ArrowRightIcon,
} from "lucide-vue-next";
</script>
