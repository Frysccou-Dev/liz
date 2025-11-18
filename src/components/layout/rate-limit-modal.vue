<template>
  <Transition name="fade">
    <div
      v-if="isVisible"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-9998"
    >
      <div
        class="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full mx-4 flex flex-col items-center gap-6"
      >
        <div class="w-24 h-24">
          <img
            src="@/assets/recommendations/ope.gif"
            alt="Please wait"
            class="w-full h-full object-contain"
          />
        </div>

        <div class="text-center">
          <h2 class="text-2xl font-light text-gray-900 mb-2">Un momentito...</h2>
          <p class="text-sm text-gray-600 font-light leading-relaxed">
            Parece que estás siendo muy rápido! 😅 Recargaste demasiadas veces en poco tiempo.
            Espera un poquito antes de intentar de nuevo.
          </p>
        </div>

        <div class="w-full bg-gray-100 rounded-lg p-4 text-center">
          <p class="text-2xl font-light text-gray-900 mb-1">{{ remainingTime }}</p>
          <p class="text-xs text-gray-500 font-light">segundos... ⏳</p>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount } from "vue";

const isVisible = ref(false);
const remainingTime = ref(0);
let timeoutId: ReturnType<typeof setTimeout> | null = null;
let intervalId: ReturnType<typeof setInterval> | null = null;

const clearAllTimers = () => {
  if (timeoutId !== null) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
};

const show = () => {
  isVisible.value = true;
};

const hide = () => {
  clearAllTimers();
  isVisible.value = false;
  remainingTime.value = 0;
};

const showWithTimeout = (duration: number = 10000) => {
  clearAllTimers();

  show();
  const seconds = Math.ceil(duration / 1000);
  remainingTime.value = seconds;

  intervalId = setInterval(() => {
    remainingTime.value--;
  }, 1000);

  timeoutId = setTimeout(() => {
    hide();
  }, duration);
};

onBeforeUnmount(() => {
  clearAllTimers();
});

defineExpose({
  show,
  hide,
  showWithTimeout,
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
