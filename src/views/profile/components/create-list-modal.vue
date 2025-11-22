<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center px-4">
    <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="$emit('close')"></div>
    <div class="bg-white rounded-2xl w-full max-w-md p-6 relative z-10 animate-scale-in">
      <h3 class="text-xl font-medium text-gray-900 mb-6">Create New List</h3>
      <form @submit.prevent="$emit('submit')" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            :value="name"
            @input="$emit('update:name', ($event.target as HTMLInputElement).value)"
            type="text"
            required
            class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
            placeholder="My Favorites"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            :value="description"
            @input="$emit('update:description', ($event.target as HTMLTextAreaElement).value)"
            rows="3"
            class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
            placeholder="A collection of..."
          ></textarea>
        </div>
        <div class="flex justify-end gap-3 mt-6">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {{ loading ? "Creating..." : "Create" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  name: string;
  description: string;
  loading: boolean;
}>();

defineEmits<{
  (e: "close"): void;
  (e: "submit"): void;
  (e: "update:name", value: string): void;
  (e: "update:description", value: string): void;
}>();
</script>
