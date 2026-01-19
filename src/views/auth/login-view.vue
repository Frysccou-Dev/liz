<template>
  <div class="min-h-screen flex items-center justify-center px-4">
    <div class="max-w-md w-full p-8 space-y-8 animate-fade-in">
      <div class="text-center">
        <h2 class="text-3xl font-light text-gray-900 tracking-wide">Welcome Back</h2>
        <p class="mt-2 text-sm text-gray-600">Sign in to your account</p>
      </div>

      <form class="space-y-6" @submit.prevent="handleLogin">
        <div class="space-y-4">
          <div>
            <label for="email" class="sr-only">Email address</label>
            <input
              id="email"
              v-model="email"
              name="email"
              type="email"
              required
              class="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
              placeholder="Email address"
            />
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input
              id="password"
              v-model="password"
              name="password"
              type="password"
              required
              class="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
              placeholder="Password"
            />
          </div>
        </div>

        <div v-if="error" class="text-red-500 text-sm text-center">
          {{ error }}
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading">Signing in...</span>
            <span v-else>Sign in</span>
          </button>
        </div>
      </form>

      <div class="text-center">
        <p class="text-sm text-gray-600">
          Don't have an account?
          <router-link
            to="/register"
            class="font-medium text-gray-900 hover:text-gray-700 transition-colors"
          >
            Sign up
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "@/utils/supabase";

const router = useRouter();
const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref<string | null>(null);

const handleLogin = async () => {
  loading.value = true;
  error.value = null;

  try {
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });

    if (authError) throw authError;

    router.push("/profile");
  } catch (e: unknown) {
    if (e instanceof Error) {
      error.value = e.message;
    } else if (typeof e === "object" && e !== null && "message" in e) {
      error.value = (e as { message: string }).message;
    } else {
      error.value = "An error occurred";
    }
  } finally {
    loading.value = false;
  }
};
</script>
