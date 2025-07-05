import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSwipeStore } from "../store/useSwipeStore";
import {
  Trash2,
  Star,
  Calendar,
  Play,
  Heart,
  Filter,
  Search,
} from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { cn } from "../lib/utils";

const Saved = () => {
  const navigate = useNavigate();
  const { savedMovies, removeSavedMovie } = useSwipeStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [hoveredMovie, setHoveredMovie] = useState<number | null>(null);

  const getGenreNames = (genreIds: number[]) => {
    const genreMap: { [key: number]: string } = {
      28: "Action",
      12: "Adventure",
      16: "Animation",
      35: "Comedy",
      80: "Crime",
      99: "Documentary",
      18: "Drama",
      10751: "Family",
      14: "Fantasy",
      36: "History",
      27: "Horror",
      10402: "Music",
      9648: "Mystery",
      10749: "Romance",
      878: "Sci-Fi",
      10770: "TV Movie",
      53: "Thriller",
      10752: "War",
      37: "Western",
    };

    return genreIds
      .slice(0, 2)
      .map((id) => genreMap[id] || "Unknown")
      .join(", ");
  };

  const getAllGenres = () => {
    const genreMap: { [key: number]: string } = {
      28: "Action",
      12: "Adventure",
      16: "Animation",
      35: "Comedy",
      80: "Crime",
      99: "Documentary",
      18: "Drama",
      10751: "Family",
      14: "Fantasy",
      36: "History",
      27: "Horror",
      10402: "Music",
      9648: "Mystery",
      10749: "Romance",
      878: "Sci-Fi",
      10770: "TV Movie",
      53: "Thriller",
      10752: "War",
      37: "Western",
    };

    const allGenres = new Set<string>();
    savedMovies.forEach((movie) => {
      movie.genre_ids.forEach((genreId) => {
        if (genreMap[genreId]) {
          allGenres.add(genreMap[genreId]);
        }
      });
    });
    return Array.from(allGenres).sort();
  };

  const filteredMovies = savedMovies.filter((movie) => {
    const matchesSearch = movie.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesGenre =
      !selectedGenre ||
      movie.genre_ids.some((genreId) => {
        const genreMap: { [key: number]: string } = {
          28: "Action",
          12: "Adventure",
          16: "Animation",
          35: "Comedy",
          80: "Crime",
          99: "Documentary",
          18: "Drama",
          10751: "Family",
          14: "Fantasy",
          36: "History",
          27: "Horror",
          10402: "Music",
          9648: "Mystery",
          10749: "Romance",
          878: "Sci-Fi",
          10770: "TV Movie",
          53: "Thriller",
          10752: "War",
          37: "Western",
        };
        return genreMap[genreId] === selectedGenre;
      });

    return matchesSearch && matchesGenre;
  });

  const handleMovieClick = (movieId: number) => {
    navigate(`/movie/${movieId}`);
  };

  const handleRemoveMovie = (e: React.MouseEvent, movieId: number) => {
    e.stopPropagation();
    removeSavedMovie(movieId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pb-20">
      <div className="px-6 pt-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            Your Movie Collection
          </h1>
          <p className="text-white/60 text-lg">
            {savedMovies.length} movies saved • {filteredMovies.length} showing
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 space-y-4"
        >
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
            <input
              type="text"
              placeholder="Search your movies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm"
            />
          </div>

          {/* Genre Filter */}
          {getAllGenres().length > 0 && (
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedGenre === null ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedGenre(null)}
                className={cn(
                  "text-sm",
                  selectedGenre === null
                    ? "bg-purple-600 text-white hover:bg-purple-700"
                    : "bg-white/10 text-white/80 hover:bg-white/20 hover:text-white"
                )}
              >
                All
              </Button>
              {getAllGenres().map((genre) => (
                <Button
                  key={genre}
                  variant={selectedGenre === genre ? "default" : "ghost"}
                  size="sm"
                  onClick={() =>
                    setSelectedGenre(selectedGenre === genre ? null : genre)
                  }
                  className={cn(
                    "text-sm",
                    selectedGenre === genre
                      ? "bg-purple-600 text-white hover:bg-purple-700"
                      : "bg-white/10 text-white/80 hover:bg-white/20 hover:text-white"
                  )}
                >
                  {genre}
                </Button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Movies Grid */}
        {filteredMovies.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center py-20"
          >
            <Heart className="w-16 h-16 text-white/40 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">
              {searchTerm || selectedGenre
                ? "No movies found"
                : "No saved movies yet"}
            </h2>
            <p className="text-white/60 mb-8 max-w-md mx-auto">
              {searchTerm || selectedGenre
                ? "Try adjusting your search or filter criteria"
                : "Start swiping to build your personal movie collection!"}
            </p>
            {!searchTerm && !selectedGenre && (
              <Button
                onClick={() => navigate("/swipe")}
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3"
              >
                Discover Movies
              </Button>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <AnimatePresence>
              {filteredMovies.map((movie, index) => (
                <motion.div
                  key={movie.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="group cursor-pointer"
                  onClick={() => handleMovieClick(movie.id)}
                  onMouseEnter={() => setHoveredMovie(movie.id)}
                  onMouseLeave={() => setHoveredMovie(null)}
                >
                  <Card className="bg-white/10 border-white/20 backdrop-blur-sm overflow-hidden hover:bg-white/20 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
                    {/* Movie Poster */}
                    <div className="relative aspect-[2/3] overflow-hidden">
                      {movie.poster_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                          alt={movie.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-600/20 to-pink-600/20 flex items-center justify-center">
                          <div className="text-white/60 text-center">
                            <Play className="w-12 h-12 mx-auto mb-2" />
                            <div className="text-sm">No Image</div>
                          </div>
                        </div>
                      )}

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Rating Badge */}
                      <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        {movie.vote_average.toFixed(1)}
                      </div>

                      {/* Remove Button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => handleRemoveMovie(e, movie.id)}
                        className="absolute top-3 left-3 bg-red-500/80 hover:bg-red-600 text-white w-8 h-8 opacity-0 group-hover:opacity-100 transition-all duration-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>

                      {/* Play Button */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                          <Play className="w-8 h-8 text-white ml-1" />
                        </div>
                      </div>
                    </div>

                    {/* Movie Info */}
                    <CardContent className="p-4">
                      <h3 className="font-bold text-white mb-2 line-clamp-2 group-hover:text-purple-300 transition-colors">
                        {movie.title}
                      </h3>

                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-white/60 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(movie.release_date).getFullYear()}
                        </span>
                        <span className="text-xs text-purple-300 font-medium">
                          {getGenreNames(movie.genre_ids)}
                        </span>
                      </div>

                      <p className="text-white/60 text-sm leading-relaxed line-clamp-3">
                        {movie.overview}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default Saved;
