<script setup lang="ts">
import Footer from "@/components/layout/footer.vue";
import Navbar from "./components/layout/navbar.vue";
</script>

<template>
  <Navbar />
  <router-view />
  <Footer />
</template>

<style scoped></style>
