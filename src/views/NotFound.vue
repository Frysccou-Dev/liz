<template>
  <section
    class="relative flex flex-col items-center justify-center min-h-screen overflow-hidden  text-[#1a1a1a] font-mono selection:bg-black selection:text-white"
  >
    <div class="absolute inset-0 w-full h-full pointer-events-none">
      <div class="absolute top-0 left-1/4 w-px h-full bg-gray-200"></div>
      <div class="absolute top-0 right-1/4 w-px h-full bg-gray-200"></div>
      <div class="absolute top-1/3 left-0 w-full h-px bg-gray-200"></div>
      <div class="absolute bottom-1/3 left-0 w-full h-px bg-gray-200"></div>
    </div>

    <div class="z-10 flex flex-col items-center animate-fade-in-up">
      <div class="relative mb-8">
        <h1
          class="text-[10rem] md:text-[15rem] leading-none font-black tracking-tighter text-transparent bg-clip-text bg-linear-to-b from-gray-900 to-gray-400 select-none font-sans"
        >
          4.04
        </h1>
        <div
          class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex justify-center"
        >
          <span
            class="px-4 bg-[#FAFAFA] text-sm tracking-[0.5em] text-gray-500 uppercase border border-gray-200"
          >
            Not Found
          </span>
        </div>
      </div>

      <div class="flex flex-col items-center space-y-6 text-center max-w-md px-4">
        <div class="space-y-2">
          <p class="text-xs font-bold tracking-widest uppercase text-gray-400">
            System Notification
          </p>
          <p class="text-lg md:text-xl font-light">
            The page you are looking for has been disconnected.
          </p>
          <p class="text-xs text-gray-400 mt-1">お探しのページは見つかりませんでした。</p>
        </div>

        <div class="w-16 h-px bg-gray-300 my-8"></div>

        <router-link
          to="/"
          class="group relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-medium transition-all duration-300 bg-transparent border border-gray-900 hover:bg-gray-900 hover:text-white"
        >
          <span
            class="absolute w-0 h-0 transition-all duration-500 ease-out bg-gray-900 rounded-full group-hover:w-56 group-hover:h-56 opacity-10"
          ></span>
          <span class="relative flex items-center gap-2 tracking-widest text-xs uppercase">
            <span
              class="w-1.5 h-1.5 bg-gray-900 group-hover:bg-white rounded-full animate-pulse"
            ></span>
            Return to Base
          </span>
        </router-link>
      </div>
    </div>

    <div
      class="absolute bottom-8 left-8 text-[10px] text-gray-400 tracking-widest flex flex-col gap-1"
    >
      <span>ID: 404-ERR-NULL</span>
      <span>LOC: UNKNOWN_SECTOR</span>
    </div>

    <div
      class="absolute bottom-8 right-8 text-[10px] text-gray-400 tracking-widest text-right flex flex-col gap-1"
    >
      <span>SYS.VER.3.0</span>
      <span class="animate-pulse">● CONNECTED</span>
    </div>
  </section>
</template>

<script setup lang="ts"></script>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
