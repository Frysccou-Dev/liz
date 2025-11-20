<script setup lang="ts">
import { ref, onMounted } from "vue";
import Footer from "@/components/layout/footer.vue";
import Navbar from "./components/layout/navbar.vue";
import RateLimitModal from "@/components/layout/rate-limit-modal.vue";
import { useAuth } from "@/composables/useAuth";

const rateLimitModalRef = ref<InstanceType<typeof RateLimitModal>>();
const { initializeAuth } = useAuth();

declare global {
  interface Window {
    showRateLimitModal: (duration?: number) => void;
  }
}

window.showRateLimitModal = (duration: number = 10000) => {
  rateLimitModalRef.value?.showWithTimeout(duration);
};

onMounted(() => {
  initializeAuth();
});
</script>

<template>
  <Navbar />
  <RateLimitModal ref="rateLimitModalRef" />
  <router-view />
  <Footer />
</template>

<style scoped></style>
