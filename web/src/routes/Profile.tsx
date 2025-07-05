import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSwipeStore } from "../store/useSwipeStore";
import supabase from "../config/supabaseClient";
import {
  User,
  Settings,
  LogOut,
  Heart,
  Film,
  Star,
  Calendar,
  Share2,
  ChevronRight,
  Trash2,
  Trophy,
  Target,
  Smile,
} from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { cn } from "../lib/utils";

interface UserProfile {
  id: string;
  email: string;
  created_at: string;
  preferences: {
    selectedActivity?: string;
    selectedMood?: string;
  };
  stats: {
    saved_movies_count: number;
  };
}

const Profile = () => {
  const navigate = useNavigate();
  const {
    user,
    savedMovies,
    clearSavedMovies,
    selectedActivity,
    selectedMood,
    logout,
  } = useSwipeStore();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (user) {
      // Create a mock profile with current preferences
      setUserProfile({
        id: user.id,
        email: user.email || "Unknown",
        created_at: user.created_at,
        preferences: {
          selectedActivity: selectedActivity || undefined,
          selectedMood: selectedMood || undefined,
        },
        stats: {
          saved_movies_count: savedMovies.length,
        },
      });
    }
    setLoading(false);
  }, [user, selectedActivity, selectedMood, savedMovies.length]);

  const handleLogout = async () => {
    try {
      // First sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error signing out from Supabase:", error);
      }

      // Then clear all app state
      logout();

      // Navigate to auth page
      navigate("/auth");
    } catch (error) {
      console.error("Error during logout:", error);
      // Even if Supabase fails, clear app state
      logout();
      navigate("/auth");
    }
  };

  const handleClearData = () => {
    if (
      window.confirm(
        "Are you sure you want to clear all saved movies? This action cannot be undone."
      )
    ) {
      clearSavedMovies();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getInitials = (email: string) => {
    return email.split("@")[0].substring(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/80 text-lg">Loading profile...</p>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <User className="w-16 h-16 text-white/60 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Not logged in</h2>
          <p className="text-white/60 mb-6">
            Please log in to view your profile
          </p>
          <Button
            onClick={() => navigate("/auth")}
            className="bg-white text-black hover:bg-white/90"
          >
            Go to Login
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pb-20">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm"></div>
        <div className="relative px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  {getInitials(user.email)}
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white shadow-lg"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">
                  {user.email?.split("@")[0] || "Movie Lover"}
                </h1>
                <p className="text-white/70 text-sm">
                  Member since{" "}
                  {userProfile
                    ? formatDate(userProfile.created_at)
                    : "Recently"}
                </p>
              </div>
            </motion.div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSettings(!showSettings)}
              className="text-white/80 hover:text-white hover:bg-white/10"
            >
              <Settings className="w-6 h-6" />
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <Heart className="w-8 h-8 text-red-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">
                    {savedMovies.length}
                  </div>
                  <div className="text-white/60 text-sm">Saved</div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <Film className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">
                    {savedMovies.length * 3}
                  </div>
                  <div className="text-white/60 text-sm">Watched</div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">
                    {Math.floor(savedMovies.length / 5)}
                  </div>
                  <div className="text-white/60 text-sm">Streaks</div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Settings Menu */}
      {showSettings && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="mx-4 mb-6"
        >
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-2">
              <Button
                variant="ghost"
                className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10"
                onClick={() =>
                  navigator.share
                    ? navigator.share({
                        title: "MovieSwiper Profile",
                        text: `Check out my movie collection! I've saved ${savedMovies.length} movies.`,
                        url: window.location.href,
                      })
                    : navigator.clipboard.writeText(window.location.href)
                }
              >
                <Share2 className="w-5 h-5 mr-3" />
                Share Profile
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10"
                onClick={handleClearData}
              >
                <Trash2 className="w-5 h-5 mr-3" />
                Clear Saved Movies
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10"
                onClick={handleLogout}
              >
                <LogOut className="w-5 h-5 mr-3" />
                Logout
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Content */}
      <div className="px-6 space-y-6">
        {/* Preferences */}
        {(selectedActivity || selectedMood) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Your Preferences
                </CardTitle>
                <CardDescription className="text-white/60">
                  Movies tailored to your mood and activity
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {selectedActivity && (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-white/80">Activity:</span>
                    <span className="text-white font-medium">
                      {selectedActivity}
                    </span>
                  </div>
                )}
                {selectedMood && (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                    <span className="text-white/80">Mood:</span>
                    <span className="text-white font-medium">
                      {selectedMood}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Saved Movies Preview */}
        {savedMovies.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    <Heart className="w-5 h-5" />
                    Your Movie Collection
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/saved")}
                    className="text-white/80 hover:text-white hover:bg-white/10"
                  >
                    View All
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
                <CardDescription className="text-white/60">
                  {savedMovies.length} movies in your collection
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {savedMovies.slice(0, 6).map((movie, index) => (
                    <motion.div
                      key={movie.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex-shrink-0 cursor-pointer"
                      onClick={() => navigate(`/movie/${movie.id}`)}
                    >
                      <div className="w-24 h-36 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                        <img
                          src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                          alt={movie.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10"
                onClick={() => navigate("/swipe")}
              >
                <Film className="w-5 h-5 mr-3" />
                Discover New Movies
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10"
                onClick={() => navigate("/saved")}
              >
                <Heart className="w-5 h-5 mr-3" />
                View Saved Movies
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10"
                onClick={() => navigate("/onboarding/activity")}
              >
                <Target className="w-5 h-5 mr-3" />
                Update Preferences
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
