import { ref, computed } from "vue";
import { supabase } from "@/utils/supabase";
import type { User } from "@supabase/supabase-js";
import { useRouter } from "vue-router";

const user = ref<User | null>(null);
export interface Profile {
  id: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
  updated_at?: string;
}

const profile = ref<Profile | null>(null);
const loading = ref(true);

export function useAuth() {
  const router = useRouter();

  const initializeAuth = async () => {
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

  const fetchProfile = async () => {
    if (!user.value) return;
    const { data } = await supabase.from("profiles").select("*").eq("id", user.value.id).single();
    profile.value = data;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return {
    user: computed(() => user.value),
    profile: computed(() => profile.value),
    loading: computed(() => loading.value),
    initializeAuth,
    signOut,
  };
}
