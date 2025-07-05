import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
}

interface SwipeState {
  // User state
  user: any | null;
  isAuthenticated: boolean;

  // Onboarding state
  selectedActivity: string | null;
  selectedMood: string | null;

  // Movies state
  currentMovies: Movie[];
  currentIndex: number;
  savedMovies: Movie[];
  isLoading: boolean;

  // Actions
  setUser: (user: any) => void;
  logout: () => void;
  setActivity: (activity: string) => void;
  setMood: (mood: string) => void;
  setMovies: (movies: Movie[]) => void;
  swipeMovie: (direction: "left" | "right") => void;
  saveMovie: (movie: Movie) => void;
  addSavedMovie: (movie: Movie) => void;
  nextMovie: () => void;
  resetOnboarding: () => void;
  setLoading: (loading: boolean) => void;
  getSavedMovies: () => Movie[];
  removeSavedMovie: (movieId: number) => void;
  clearSavedMovies: () => void;
  clearUserData: () => void;
}

export const useSwipeStore = create<SwipeState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      selectedActivity: null,
      selectedMood: null,
      currentMovies: [],
      currentIndex: 0,
      savedMovies: [],
      isLoading: false,

      // Actions
      setUser: (user) => {
        const state = get();

        // If switching users, clear the saved movies
        if (state.user && user && state.user.id !== user.id) {
          set({
            user,
            isAuthenticated: !!user,
            savedMovies: [],
            selectedActivity: null,
            selectedMood: null,
          });
        } else {
          set({ user, isAuthenticated: !!user });
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          selectedActivity: null,
          selectedMood: null,
          currentMovies: [],
          currentIndex: 0,
          savedMovies: [],
          isLoading: false,
        });
        // Clear the persisted storage
        localStorage.removeItem("movie-swiper-store");
      },

      setActivity: (activity) => set({ selectedActivity: activity }),

      setMood: (mood) => set({ selectedMood: mood }),

      setMovies: (movies) =>
        set({
          currentMovies: movies,
          currentIndex: 0,
        }),

      swipeMovie: (direction) => {
        const { currentMovies, currentIndex } = get();
        const currentMovie = currentMovies[currentIndex];

        if (direction === "right" && currentMovie) {
          // Save to favorites
          set((state) => ({
            savedMovies: [...state.savedMovies, currentMovie],
          }));
        }

        // Move to next movie
        get().nextMovie();
      },

      saveMovie: (movie) =>
        set((state) => ({
          savedMovies: [...state.savedMovies, movie],
        })),

      addSavedMovie: (movie) =>
        set((state) => ({
          savedMovies: state.savedMovies.some((m) => m.id === movie.id)
            ? state.savedMovies
            : [...state.savedMovies, movie],
        })),

      nextMovie: () =>
        set((state) => ({
          currentIndex: state.currentIndex + 1,
        })),

      resetOnboarding: () =>
        set({
          selectedActivity: null,
          selectedMood: null,
          currentMovies: [],
          currentIndex: 0,
        }),

      setLoading: (loading) => set({ isLoading: loading }),

      getSavedMovies: () => get().savedMovies,

      removeSavedMovie: (movieId) =>
        set((state) => ({
          savedMovies: state.savedMovies.filter(
            (movie) => movie.id !== movieId
          ),
        })),

      clearSavedMovies: () =>
        set({
          savedMovies: [],
        }),

      clearUserData: () =>
        set({
          savedMovies: [],
          selectedActivity: null,
          selectedMood: null,
          currentMovies: [],
          currentIndex: 0,
        }),
    }),
    {
      name: "movie-swiper-store",
      // Only persist certain fields
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        // Make saved movies user-specific
        savedMovies: state.user ? state.savedMovies : [],
        selectedActivity: state.selectedActivity,
        selectedMood: state.selectedMood,
      }),
    }
  )
);

// Activity options
export const ACTIVITIES = [
  { id: "gym", label: "💪 Gym", emoji: "💪" },
  { id: "eating", label: "🍽 Eating", emoji: "🍽" },
  { id: "cant-sleep", label: "🛏 Can't Sleep", emoji: "🛏" },
  { id: "commuting", label: "🚗 Commuting", emoji: "🚗" },
  { id: "relaxing", label: "🛋 Relaxing", emoji: "🛋" },
  { id: "working", label: "💻 Working", emoji: "💻" },
  { id: "date-night", label: "💕 Date Night", emoji: "💕" },
  { id: "friends", label: "👥 With Friends", emoji: "👥" },
];

// Mood options
export const MOODS = [
  { id: "funny", label: "🤣 Funny", emoji: "🤣" },
  { id: "smart", label: "🧠 Smart", emoji: "🧠" },
  { id: "emotional", label: "😢 Emotional", emoji: "😢" },
  { id: "thrilling", label: "🎯 Thrilling", emoji: "🎯" },
  { id: "romantic", label: "💕 Romantic", emoji: "💕" },
  { id: "adventurous", label: "🗺 Adventurous", emoji: "🗺" },
  { id: "mysterious", label: "🔍 Mysterious", emoji: "🔍" },
  { id: "uplifting", label: "✨ Uplifting", emoji: "✨" },
];
