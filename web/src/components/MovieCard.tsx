import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Calendar,
  Info,
  Heart,
  X,
  Play,
  Clock,
  TrendingUp,
  Award,
  Sparkles,
} from "lucide-react";

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
}

interface MovieCardProps {
  movie: Movie;
  onClick: (movie: Movie) => void;
  isDragging: boolean;
  dragDirection: "left" | "right" | null;
}

const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  onClick,
  isDragging,
  dragDirection,
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    if (!isDragging) {
      e.stopPropagation();
      onClick(movie);
    }
  };

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
      878: "Science Fiction",
      10770: "TV Movie",
      53: "Thriller",
      10752: "War",
      37: "Western",
    };

    return genreIds.slice(0, 3).map((id) => genreMap[id] || "Unknown");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).getFullYear();
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 8) return "from-green-500 to-emerald-500";
    if (rating >= 7) return "from-yellow-500 to-orange-500";
    if (rating >= 6) return "from-orange-500 to-red-500";
    return "from-red-500 to-pink-500";
  };

  const getRatingIcon = (rating: number) => {
    if (rating >= 8.5) return <Award className="w-4 h-4" />;
    if (rating >= 7.5) return <TrendingUp className="w-4 h-4" />;
    return <Star className="w-4 h-4" />;
  };

  return (
    <motion.div
      className={`
        w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 
        rounded-3xl overflow-hidden shadow-2xl cursor-pointer transition-all duration-500
        border border-white/10 backdrop-blur-sm relative group
        ${
          isDragging
            ? "shadow-purple-500/30 shadow-2xl"
            : "hover:shadow-purple-500/20"
        }
      `}
      onClick={handleClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      whileHover={{ scale: isDragging ? 1.05 : 1.02 }}
      whileTap={{ scale: isDragging ? 1.05 : 0.98 }}
      layout
    >
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-pink-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Shimmer Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />

      {/* Movie Poster Section */}
      <div className="relative h-3/5 overflow-hidden">
        {/* Skeleton Loading */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-800 animate-pulse" />
        )}

        <motion.img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="w-full h-full object-cover transition-all duration-500"
          style={{
            filter: isDragging
              ? "brightness(1.2) saturate(1.3)"
              : "brightness(1)",
            transform: isHovering ? "scale(1.1)" : "scale(1)",
          }}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            e.currentTarget.src = "/placeholder-movie.png";
            setImageLoaded(true);
          }}
        />

        {/* Premium Rating Badge */}
        <motion.div
          className="absolute top-4 right-4"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div
            className={`
            bg-gradient-to-r ${getRatingColor(movie.vote_average)} 
            backdrop-blur-xl px-3 py-2 rounded-full border border-white/30 shadow-lg
          `}
          >
            <div className="flex items-center gap-1">
              <div className="text-white">
                {getRatingIcon(movie.vote_average)}
              </div>
              <span className="text-white text-sm font-bold">
                {movie.vote_average.toFixed(1)}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Quality Badge */}
        {movie.vote_average >= 8 && (
          <motion.div
            className="absolute top-4 left-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 backdrop-blur-xl px-3 py-1 rounded-full border border-white/30">
              <div className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-white" />
                <span className="text-white text-xs font-bold">Premium</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/40 via-transparent to-slate-900/40" />

        {/* Movie Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-white font-bold text-2xl leading-tight mb-3 line-clamp-2 drop-shadow-lg">
              {movie.title}
            </h3>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                <Calendar className="w-3 h-3 text-white/80" />
                <span className="text-white/90 text-xs font-medium">
                  {formatDate(movie.release_date)}
                </span>
              </div>
              <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                <Clock className="w-3 h-3 text-white/80" />
                <span className="text-white/90 text-xs font-medium">
                  2h 15m
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Hover Play Button */}
        <AnimatePresence>
          {isHovering && !isDragging && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="bg-white/20 backdrop-blur-xl rounded-full p-4 border border-white/30">
                <Play className="w-8 h-8 text-white fill-white" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Movie Details Section */}
      <div className="p-6 h-2/5 flex flex-col justify-between relative">
        {/* Genres */}
        <motion.div
          className="flex flex-wrap gap-2 mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {getGenreNames(movie.genre_ids).map((genre, index) => (
            <motion.span
              key={index}
              className="bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-white/90 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm border border-white/20"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              {genre}
            </motion.span>
          ))}
        </motion.div>

        {/* Overview */}
        <motion.p
          className="text-white/80 text-sm leading-relaxed line-clamp-3 mb-4 flex-grow"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {movie.overview}
        </motion.p>

        {/* Action Section */}
        <motion.div
          className="flex items-center justify-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="flex items-center gap-2 text-white/70 text-sm bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
            <Info className="w-4 h-4" />
            <span>Tap for details</span>
          </div>
        </motion.div>
      </div>

      {/* Drag Direction Indicator */}
      <AnimatePresence>
        {dragDirection && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`absolute inset-0 flex items-center justify-center backdrop-blur-lg ${
              dragDirection === "right"
                ? "bg-gradient-to-br from-green-500/90 to-emerald-500/90"
                : "bg-gradient-to-br from-red-500/90 to-pink-500/90"
            }`}
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="mb-4"
              >
                {dragDirection === "right" ? (
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl">
                    <Heart className="w-10 h-10 text-green-500 fill-green-500" />
                  </div>
                ) : (
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl">
                    <X className="w-10 h-10 text-red-500" />
                  </div>
                )}
              </motion.div>
              <motion.p
                className="text-white text-2xl font-bold drop-shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {dragDirection === "right" ? "LOVE IT!" : "PASS"}
              </motion.p>
              <motion.p
                className="text-white/80 text-sm mt-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {dragDirection === "right"
                  ? "Added to favorites"
                  : "Maybe next time"}
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating particles effect */}
      {isHovering && !isDragging && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/60 rounded-full"
              initial={{
                opacity: 0,
                x: Math.random() * 100 + "%",
                y: "100%",
              }}
              animate={{
                opacity: [0, 1, 0],
                y: "0%",
              }}
              transition={{
                duration: 2,
                delay: i * 0.2,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default MovieCard;
