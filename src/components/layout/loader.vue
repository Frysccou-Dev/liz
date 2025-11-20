<template>
  <Transition name="fade">
    <div
      v-if="isVisible"
      class="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-9999"
    >
      <div class="flex flex-col items-center gap-6">
        <div class="relative w-16 h-16">
          <div class="absolute inset-0 border-2 border-gray-200 rounded-full"></div>
          <div
            class="absolute inset-0 border-2 border-transparent border-t-gray-900 rounded-full animate-spin"
          ></div>
        </div>
        <p class="text-sm text-gray-600 font-light tracking-wide">Loading...</p>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const isVisible = ref(true);

const hideLoader = () => {
  isVisible.value = false;
};

const showLoader = () => {
  isVisible.value = true;
};

onMounted(() => {
  const handleLoad = () => {
    setTimeout(() => {
      hideLoader();
    }, 300);
  };

  window.addEventListener("load", handleLoad);

  if (document.readyState === "complete") {
    handleLoad();
  }

  return () => {
    window.removeEventListener("load", handleLoad);
  };
});

defineExpose({
  hideLoader,
  showLoader,
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
