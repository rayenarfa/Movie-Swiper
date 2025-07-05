import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import SwipeDeck from "../components/SwipeDeck";
import FilterModal from "../components/FilterModal";
import { useSwipeStore } from "../store/useSwipeStore";
import supabase from "../config/supabaseClient";
import { buildApiUrl } from "../config/api";
import {
  Filter,
  RefreshCw,
  X,
  Info,
  Heart,
  Sparkles,
  ArrowLeft,
  Settings,
  TrendingUp,
  Star,
  Calendar,
  Clock,
  Eye,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";

interface FilterOptions {
  year?: string;
  rating?: string;
  duration?: string;
}

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
}

const Swipe: React.FC = () => {
  const navigate = useNavigate();
  const {
    selectedActivity,
    selectedMood,
    savedMovies,
    addSavedMovie,
    currentMovies,
    currentIndex,
    setMovies,
    nextMovie,
  } = useSwipeStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [user, setUser] = useState<any>(null);
  const [showMovieDetails, setShowMovieDetails] = useState(false);
  const isLoadingRef = useRef(false);
  const hasStartedFetch = useRef(false);

  const checkUser = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    } catch (error) {
      console.error("Error checking user:", error);
    }
  };

  const fetchRecommendations = useCallback(async () => {
    if (!selectedActivity || !selectedMood) {
      navigate("/onboarding/activity");
      return;
    }

    // Prevent duplicate API calls
    if (isLoadingRef.current) {
      return;
    }

    isLoadingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        buildApiUrl("/api/movies/recommendations", {
          activity: selectedActivity,
          mood: selectedMood,
          ...filters,
        }),
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch recommendations");
      }

      const data = await response.json();
      setMovies(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch recommendations"
      );
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, [selectedActivity, selectedMood, navigate]);

  useEffect(() => {
    checkUser();
  }, []);

  const handleSwipeLeft = () => {
    if (currentIndex < currentMovies.length - 1) {
      nextMovie();
    } else {
      fetchWithFilters(filters);
    }
  };

  const handleSwipeRight = async (movie: Movie) => {
    addSavedMovie(movie);

    // Also save to database if user is logged in
    if (user) {
      try {
        await fetch(buildApiUrl("/api/user/saved"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
            movie: movie,
          }),
        });
      } catch (error) {
        console.error("Error saving to database:", error);
      }
    }

    if (currentIndex < currentMovies.length - 1) {
      nextMovie();
    } else {
      fetchWithFilters(filters);
    }
  };

  const handleMovieDetails = (movie: Movie) => {
    navigate(`/movie/${movie.id}`, { state: { movie } });
  };

  const fetchWithFilters = useCallback(
    async (filterOptions: FilterOptions) => {
      if (!selectedActivity || !selectedMood) {
        navigate("/onboarding/activity");
        return;
      }

      // Prevent duplicate API calls
      if (isLoadingRef.current) {
        return;
      }

      isLoadingRef.current = true;
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          buildApiUrl("/api/movies/recommendations", {
            activity: selectedActivity,
            mood: selectedMood,
            ...filterOptions,
          }),
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch recommendations");
        }

        const data = await response.json();
        setMovies(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch recommendations"
        );
      } finally {
        setLoading(false);
        isLoadingRef.current = false;
      }
    },
    [selectedActivity, selectedMood, navigate]
  );

  const handleApplyFilters = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    fetchWithFilters(newFilters);
  };

  const handleRefresh = () => {
    fetchWithFilters(filters);
  };

  if (!selectedActivity || !selectedMood) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 flex items-center justify-center p-6">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-64 h-64 bg-red-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <Card className="bg-white/10 border-white/20 backdrop-blur-xl shadow-2xl max-w-md w-full relative z-10">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Setup Required
            </h2>
            <p className="text-white/70 mb-6">
              Please select your activity and mood to get personalized movie
              recommendations
            </p>
            <Button
              onClick={() => navigate("/onboarding/activity")}
              className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-semibold"
            >
              Get Started
              <ArrowLeft className="w-5 h-5 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentMovies.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 flex items-center justify-center p-6">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-64 h-64 bg-gray-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-64 h-64 bg-slate-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <Card className="bg-white/10 border-white/20 backdrop-blur-xl shadow-2xl max-w-md w-full relative z-10">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-500 to-slate-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <RefreshCw className="w-8 h-8 text-white animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Loading Movies
            </h2>
            <p className="text-white/70 mb-6">
              We're finding the perfect movies for you
            </p>
            <Button
              onClick={() => navigate("/loading")}
              className="bg-gradient-to-r from-gray-600 to-slate-600 hover:from-gray-700 hover:to-slate-700 text-white px-6 py-3 rounded-xl font-semibold"
            >
              Go Back
              <ArrowLeft className="w-5 h-5 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pb-20">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-white/10 backdrop-blur-xl border-b border-white/20">
        <div className="p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Discover Movies
                </h1>
                <div className="flex gap-2 mt-1">
                  <span className="px-3 py-1 text-sm text-white bg-purple-600/80 rounded-full backdrop-blur-sm">
                    {selectedActivity?.replace("-", " ")}
                  </span>
                  <span className="px-3 py-1 text-sm text-white bg-pink-600/80 rounded-full backdrop-blur-sm">
                    {selectedMood}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => setShowFilters(true)}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
                size="sm"
              >
                <Filter className="w-4 h-4" />
              </Button>
              <Button
                onClick={handleRefresh}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
                size="sm"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Active Filters */}
        <AnimatePresence>
          {(filters.year || filters.rating || filters.duration) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="px-6 pb-4"
            >
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-white/70 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  Active Filters:
                </span>
                {filters.year && (
                  <div className="flex items-center gap-1 px-3 py-1 bg-purple-500/30 text-white rounded-full text-sm backdrop-blur-sm">
                    <Calendar className="w-3 h-3" />
                    {filters.year}
                  </div>
                )}
                {filters.rating && (
                  <div className="flex items-center gap-1 px-3 py-1 bg-yellow-500/30 text-white rounded-full text-sm backdrop-blur-sm">
                    <Star className="w-3 h-3" />
                    {filters.rating}+
                  </div>
                )}
                {filters.duration && (
                  <div className="flex items-center gap-1 px-3 py-1 bg-blue-500/30 text-white rounded-full text-sm backdrop-blur-sm">
                    <Clock className="w-3 h-3" />
                    {filters.duration}min
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Loading State */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center items-center h-96 relative z-10"
          >
            <Card className="bg-white/10 border-white/20 backdrop-blur-xl shadow-2xl">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <RefreshCw className="w-8 h-8 text-white animate-spin" />
                </div>
                <p className="text-white text-lg font-medium">
                  Finding perfect movies for you...
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error State */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex justify-center items-center h-96 relative z-10"
          >
            <Card className="bg-red-500/20 border-red-500/30 backdrop-blur-xl shadow-2xl max-w-md w-full mx-4">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <X className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-white text-lg font-semibold mb-2">
                  Something went wrong
                </h3>
                <p className="text-red-300 mb-6">{error}</p>
                <Button
                  onClick={handleRefresh}
                  className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-semibold"
                >
                  Try Again
                  <RefreshCw className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Movie Cards */}
      {!loading && !error && currentMovies.length > 0 && (
        <div className="flex flex-col items-center justify-center p-6 relative z-10">
          {/* Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardContent className="px-6 py-3">
                <div className="flex items-center gap-3">
                  <Eye className="w-4 h-4 text-white/70" />
                  <span className="text-white/70 text-sm">
                    {currentIndex + 1} of {currentMovies.length} movies
                  </span>
                  <div className="w-20 h-2 bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${
                          ((currentIndex + 1) / currentMovies.length) * 100
                        }%`,
                      }}
                      transition={{ duration: 0.5 }}
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <SwipeDeck
            movies={currentMovies}
            currentIndex={currentIndex}
            onSwipeLeft={handleSwipeLeft}
            onSwipeRight={handleSwipeRight}
            onMovieDetails={handleMovieDetails}
          />

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex gap-6 justify-center mt-8"
          >
            <Button
              onClick={handleSwipeLeft}
              className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-full shadow-lg transform hover:scale-110 transition-all duration-200"
            >
              <X className="w-8 h-8" />
            </Button>

            <Button
              onClick={() =>
                currentMovies[currentIndex] &&
                handleMovieDetails(currentMovies[currentIndex])
              }
              className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-full shadow-lg transform hover:scale-110 transition-all duration-200"
            >
              <Info className="w-8 h-8" />
            </Button>

            <Button
              onClick={() =>
                currentMovies[currentIndex] &&
                handleSwipeRight(currentMovies[currentIndex])
              }
              className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-full shadow-lg transform hover:scale-110 transition-all duration-200"
            >
              <Heart className="w-8 h-8" />
            </Button>
          </motion.div>

          {/* Instructions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6 text-center"
          >
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardContent className="px-6 py-3">
                <div className="flex items-center justify-center gap-4 text-white/70 text-sm">
                  <div className="flex items-center gap-1">
                    <X className="w-4 h-4 text-red-400" />
                    <span>Skip</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Info className="w-4 h-4 text-blue-400" />
                    <span>Details</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4 text-green-400" />
                    <span>Save</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}

      {/* No Movies State */}
      {!loading && !error && currentMovies.length === 0 && (
        <div className="flex justify-center items-center h-96 relative z-10">
          <Card className="bg-white/10 border-white/20 backdrop-blur-xl shadow-2xl max-w-md w-full mx-4">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-500 to-slate-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-white text-xl font-semibold mb-2">
                No Movies Found
              </h3>
              <p className="text-white/70 mb-6">
                No movies match your current preferences and filters. Try
                adjusting your settings.
              </p>
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={() => setShowFilters(true)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-xl font-semibold"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
                <Button
                  onClick={() => navigate("/onboarding/activity")}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-4 py-2 rounded-xl font-semibold"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filter Modal */}
      <FilterModal
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        onApply={handleApplyFilters}
        currentFilters={filters}
      />
    </div>
  );
};

export default Swipe;
