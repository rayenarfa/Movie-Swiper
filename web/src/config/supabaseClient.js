import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl) {
  console.error("Missing VITE_SUPABASE_URL environment variable");
  console.error("Available env vars:", Object.keys(import.meta.env));
  throw new Error("VITE_SUPABASE_URL is required");
}

if (!supabaseAnonKey) {
  console.error("Missing VITE_SUPABASE_ANON_KEY environment variable");
  console.error("Available env vars:", Object.keys(import.meta.env));
  throw new Error("VITE_SUPABASE_ANON_KEY is required");
}

console.log("Supabase URL:", supabaseUrl); // Debug log
console.log("Supabase Key exists:", !!supabaseAnonKey); // Debug log
console.log("Supabase Key length:", supabaseAnonKey?.length); // Debug log

// Create Supabase client with explicit options
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  global: {
    headers: {
      apikey: supabaseAnonKey,
    },
  },
});

// Test the client creation
console.log("Supabase client created successfully:", !!supabase);
console.log("Supabase client URL:", supabase.supabaseUrl);
console.log(
  "Supabase client key:",
  supabase.supabaseKey ? "✅ Present" : "❌ Missing"
);

// Auth helpers
export const signUp = async (email, password) => {
  console.log("Attempting signUp with:", { email, hasPassword: !!password });
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  console.log("SignUp result:", { data: !!data, error });
  return { data, error };
};

export const signIn = async (email, password) => {
  console.log("Attempting signIn with:", { email, hasPassword: !!password });
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  console.log("SignIn result:", { data: !!data, error });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
};

// Database helpers
export const saveMovieToFavorites = async (userId, movieId, movieData) => {
  const { data, error } = await supabase.from("saved_movies").insert({
    user_id: userId,
    movie_id: movieId,
    movie_data: movieData,
  });
  return { data, error };
};

export const getFavoriteMovies = async (userId) => {
  const { data, error } = await supabase
    .from("saved_movies")
    .select("*")
    .eq("user_id", userId);
  return { data, error };
};

export const saveUserPreferences = async (userId, activity, mood) => {
  const { data, error } = await supabase.from("user_preferences").upsert({
    user_id: userId,
    activity,
    mood,
  });
  return { data, error };
};

export const getUserPreferences = async (userId) => {
  const { data, error } = await supabase
    .from("user_preferences")
    .select("*")
    .eq("user_id", userId)
    .single();
  return { data, error };
};

export default supabase;
