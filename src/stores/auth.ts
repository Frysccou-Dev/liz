import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { supabase } from "@/utils/supabase";
import type { User } from "@supabase/supabase-js";
import { useRouter } from "vue-router";

export interface Profile {
  id: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
  updated_at?: string;
}

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const profile = ref<Profile | null>(null);
  const loading = ref(true);
  const router = useRouter();

  const isAuthenticated = computed(() => !!user.value);

  const fetchProfile = async () => {
    if (!user.value) return;
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.value.id)
        .single();

      if (error) throw error;
      profile.value = data;
    } catch {
      profile.value = null;
    }
  };

  const initializeAuth = async () => {
    loading.value = true;
    const { data } = await supabase.auth.getSession();
    user.value = data.session?.user ?? null;

    if (user.value) {
      await fetchProfile();
    }
    loading.value = false;

    supabase.auth.onAuthStateChange(async (_event, session) => {
      user.value = session?.user ?? null;
      if (user.value) {
        await fetchProfile();
      } else {
        profile.value = null;
      }
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    user.value = null;
    profile.value = null;
    router.push("/login");
  };

  return {
    user,
    profile,
    loading,
    isAuthenticated,
    initializeAuth,
    signOut,
    fetchProfile,
  };
});
