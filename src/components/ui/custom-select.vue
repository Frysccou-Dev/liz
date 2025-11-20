<template>
  <div class="relative" ref="containerRef">
    <button
      @click="toggle"
      class="w-full h-12 px-4 bg-gray-50/50 border border-gray-200 rounded-xl flex items-center justify-between text-sm text-gray-600 transition-all hover:bg-white hover:border-gray-300 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-100"
      :class="{ 'bg-white border-gray-300 ring-2 ring-gray-100': isOpen }"
      type="button"
    >
      <span :class="{ 'text-gray-400': !modelValue }">
        {{ selectedLabel || placeholder }}
      </span>
      <ChevronDown
        class="w-4 h-4 text-gray-400 transition-transform duration-200"
        :class="{ 'rotate-180': isOpen }"
      />
    </button>

    <Transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div
        v-if="isOpen"
        class="absolute top-full left-0 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl z-9999 overflow-hidden"
      >
        <div class="max-h-60 overflow-y-auto py-1 custom-scrollbar">
          <div
            v-for="option in options"
            :key="String(option.value)"
            @click="select(option)"
            class="px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer transition-colors flex items-center justify-between group"
            :class="{ 'bg-gray-50 text-gray-900 font-medium': isSelected(option.value) }"
          >
            <span>{{ option.label }}</span>
            <Check v-if="isSelected(option.value)" class="w-3.5 h-3.5 text-gray-900" />
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts" generic="T extends string | number | undefined">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { ChevronDown, Check } from "lucide-vue-next";

interface Option<T> {
  label: string;
  value: T;
}

const props = defineProps<{
  modelValue: T | T[];
  options: Option<T>[];
  placeholder?: string;
  multiple?: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: T | T[]];
}>();

const isOpen = ref(false);
const containerRef = ref<HTMLElement | null>(null);

const selectedLabel = computed(() => {
  if (props.multiple && Array.isArray(props.modelValue)) {
    if (props.modelValue.length === 0) return "";
    if (props.modelValue.length === 1) {
      const val = (props.modelValue as T[])[0];
      const option = props.options.find((o) => o.value === val);
      return option ? option.label : "";
    }
    return `${props.modelValue.length} seleccionados`;
  }

  const option = props.options.find((o) => o.value === props.modelValue);
  return option ? option.label : "";
});

const isSelected = (value: T) => {
  if (props.multiple && Array.isArray(props.modelValue)) {
    return props.modelValue.includes(value);
  }
  return props.modelValue === value;
};

const toggle = () => {
  isOpen.value = !isOpen.value;
};

const select = (option: Option<T>) => {
  if (props.multiple) {
    const currentValues = Array.isArray(props.modelValue) ? [...props.modelValue] : [];
    const index = currentValues.indexOf(option.value);

    if (index === -1) {
      currentValues.push(option.value);
    } else {
      currentValues.splice(index, 1);
    }
    emit("update:modelValue", currentValues);
  } else {
    emit("update:modelValue", option.value);
    isOpen.value = false;
  }
};

const handleClickOutside = (event: MouseEvent) => {
  if (containerRef.value && !containerRef.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e5e7eb;
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #d1d5db;
}
</style>
