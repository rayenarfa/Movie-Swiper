import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'your-supabase-url'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-supabase-anon-key'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Auth helpers
export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  return { data, error }
}

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// Database helpers
export const saveMovieToFavorites = async (userId: string, movieId: number, movieData: any) => {
  const { data, error } = await supabase
    .from('saved_movies')
    .insert({
      user_id: userId,
      movie_id: movieId,
      movie_data: movieData,
    })
  return { data, error }
}

export const getFavoriteMovies = async (userId: string) => {
  const { data, error } = await supabase
    .from('saved_movies')
    .select('*')
    .eq('user_id', userId)
  return { data, error }
}

export const saveUserPreferences = async (userId: string, activity: string, mood: string) => {
  const { data, error } = await supabase
    .from('user_preferences')
    .upsert({
      user_id: userId,
      activity,
      mood,
    })
  return { data, error }
}

export const getUserPreferences = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_preferences')
    .select('*')
    .eq('user_id', userId)
    .single()
  return { data, error }
} 