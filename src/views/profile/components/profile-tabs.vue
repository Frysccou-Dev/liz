<template>
  <div
    class="flex gap-6 border-b border-gray-200 animate-fade-in overflow-x-auto scrollbar-hide"
    style="animation-delay: 0.05s"
  >
    <button
      v-for="tab in tabs"
      :key="tab.id"
      @click="$emit('update:activeTab', tab.id)"
      class="pb-4 text-sm font-medium transition-colors relative whitespace-nowrap"
      :class="activeTab === tab.id ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'"
    >
      {{ tab.label }}
      <div
        v-if="activeTab === tab.id"
        class="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 rounded-t-full"
      ></div>
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  activeTab: string;
  tabs: Array<{ id: string; label: string }>;
}>();

defineEmits<{
  (e: "update:activeTab", id: string): void;
}>();
</script>
