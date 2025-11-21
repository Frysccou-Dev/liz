import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY || "";

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "Supabase variables missing! Make sure you have VITE_SUPABASE_URL and VITE_SUPABASE_KEY in your .env file."
  );
}

import Cookies from "js-cookie";

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: {
      getItem: (key) => Cookies.get(key) ?? null,
      setItem: (key, value) => {
        Cookies.set(key, value, { expires: 365, secure: true });
      },
      removeItem: (key) => {
        Cookies.remove(key);
      },
    },
  },
});
