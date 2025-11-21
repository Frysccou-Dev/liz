import { computed } from "vue";
import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from "pinia";

export function useAuth() {
  const authStore = useAuthStore();
  const { user, profile, loading } = storeToRefs(authStore);
  const { initializeAuth, signOut } = authStore;

  return {
    user: computed(() => user.value),
    profile: computed(() => profile.value),
    loading: computed(() => loading.value),
    initializeAuth,
    signOut,
  };
}
