<template>
  <div class="w-full flex justify-center px-4">
    <div class="w-[min(1100px,100%)]">
      <label class="sr-only" for="search-input">Buscar</label>
      <div
        class="flex items-center gap-3 border border-gray-200 rounded-[10px] h-16 bg-white/6 backdrop-blur-md px-6 z-999"
      >
        <div
          class="rounded-[10px] bg-gray-100/30 w-16 h-16 flex items-center justify-center shrink-0 z-0"
        >
          <Search class="h-6 w-6 text-black/70" />
        </div>
        <input
          id="search-input"
          :value="props.modelValue"
          @input="onInput($event)"
          placeholder="Busca tu anime favorito..."
          class="flex-1 bg-transparent text-black placeholder:text-black/60 focus:outline-none text-lg text-center select-none"
          aria-label="Buscar anime"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";
import { Search } from "lucide-vue-next";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);

function onInput(e: Event) {
  const target = e.target as HTMLInputElement;
  emit("update:modelValue", target.value);
}
</script>

<style scoped>
.backdrop-blur-md {
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
}
</style>
