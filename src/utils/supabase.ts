import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY || "";

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "Supabase variables missing! Make sure you have VITE_SUPABASE_URL and VITE_SUPABASE_KEY in your .env file."
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);
