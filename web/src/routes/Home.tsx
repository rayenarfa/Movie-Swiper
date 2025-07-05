import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useSwipeStore } from "../store/useSwipeStore";
import { Play, Heart, Star, TrendingUp, Zap, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

const Home = () => {
  const navigate = useNavigate();
  const { user, savedMovies, resetOnboarding } = useSwipeStore();

  const handleFindMovie = () => {
    resetOnboarding();
    navigate("/onboarding/activity");
  };

  const handleQuickSwipe = () => {
    navigate("/swipe");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pb-20">
      <div className="px-6 pt-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Play className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">MovieSwiper</h1>
          </div>
          <p className="text-xl text-white/80">
            Welcome back, {user?.email?.split("@")[0] || "Movie Lover"}!
          </p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
        >
          <Card className="bg-gradient-to-br from-purple-600 to-pink-600 border-none text-white overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold mb-1">Smart Discovery</h3>
                  <p className="text-white/80 text-sm">
                    Personalized recommendations
                  </p>
                </div>
                <Zap className="w-8 h-8 text-white/80" />
              </div>
              <Button
                onClick={handleFindMovie}
                className="w-full bg-white/20 hover:bg-white/30 text-white border-none"
              >
                Find Perfect Movie
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-600 to-purple-600 border-none text-white overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold mb-1">Quick Swipe</h3>
                  <p className="text-white/80 text-sm">
                    Jump right into discovery
                  </p>
                </div>
                <Heart className="w-8 h-8 text-white/80" />
              </div>
              <Button
                onClick={handleQuickSwipe}
                className="w-full bg-white/20 hover:bg-white/30 text-white border-none"
              >
                Start Swiping
                <Play className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-3 gap-4 mb-8"
        >
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <Heart className="w-6 h-6 text-red-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white mb-1">
                {savedMovies.length}
              </div>
              <div className="text-white/60 text-sm">Saved</div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white mb-1">
                {Math.floor(savedMovies.length * 1.5)}
              </div>
              <div className="text-white/60 text-sm">Watched</div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <Star className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white mb-1">
                {savedMovies.length > 0
                  ? (
                      savedMovies.reduce(
                        (sum, movie) => sum + movie.vote_average,
                        0
                      ) / savedMovies.length
                    ).toFixed(1)
                  : "0.0"}
              </div>
              <div className="text-white/60 text-sm">Avg Rating</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Saved Movies */}
        {savedMovies.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-8"
          >
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    <Heart className="w-5 h-5" />
                    Recently Saved
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/saved")}
                    className="text-white/80 hover:text-white hover:bg-white/10"
                  >
                    View All
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {savedMovies
                    .slice(-3)
                    .reverse()
                    .map((movie, index) => (
                      <motion.div
                        key={movie.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                        onClick={() => navigate(`/movie/${movie.id}`)}
                      >
                        <div className="w-12 h-16 bg-white/20 rounded-lg overflow-hidden">
                          <img
                            src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                            alt={movie.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="text-white font-medium truncate">
                            {movie.title}
                          </div>
                          <div className="text-white/70 text-sm">
                            {new Date(movie.release_date).getFullYear()}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-white/70">
                          <Star className="w-4 h-4 text-yellow-400" />
                          <span className="text-sm">
                            {movie.vote_average.toFixed(1)}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Empty State */}
        {savedMovies.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Play className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Ready to discover?
                </h3>
                <p className="text-white/70 mb-6 max-w-md mx-auto">
                  Start swiping through movies to build your personal collection
                  and get better recommendations!
                </p>
                <Button
                  onClick={handleFindMovie}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3"
                >
                  Get Started
                  <Zap className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Home;
