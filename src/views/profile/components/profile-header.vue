<template>
  <div
    class="bg-white rounded-2xl shadow-sm p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 animate-fade-in"
  >
    <div
      class="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gray-200 flex items-center justify-center text-2xl md:text-3xl font-light text-gray-500 shrink-0"
    >
      {{ user?.email?.charAt(0).toUpperCase() }}
    </div>
    <div class="flex-1 text-center md:text-left">
      <h2 class="text-xl md:text-2xl font-light text-gray-900">
        {{ profile?.username || "User" }}
      </h2>
      <p class="text-sm md:text-base text-gray-500">{{ user?.email }}</p>
    </div>
    <button
      @click="$emit('sign-out')"
      class="w-full md:w-auto px-6 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-red-500 transition-colors"
    >
      Sign Out
    </button>
  </div>
</template>

<script setup lang="ts">
import type { User } from "@supabase/supabase-js";
import type { Profile } from "@/stores/auth";

defineProps<{
  user: User | null;
  profile: Profile | null;
}>();

defineEmits<{
  (e: "sign-out"): void;
}>();
</script>
