import React, { useState, useRef, useEffect } from "react";
import { motion, PanInfo, AnimatePresence } from "framer-motion";
import MovieCard from "./MovieCard";
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles,
  Eye,
  Heart,
  X,
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

interface SwipeDeckProps {
  movies: Movie[];
  currentIndex: number;
  onSwipeLeft: () => void;
  onSwipeRight: (movie: Movie) => void;
  onMovieDetails: (movie: Movie) => void;
}

const SwipeDeck: React.FC<SwipeDeckProps> = ({
  movies,
  currentIndex,
  onSwipeLeft,
  onSwipeRight,
  onMovieDetails,
}) => {
  const [dragDirection, setDragDirection] = useState<"left" | "right" | null>(
    null
  );
  const [dragIntensity, setDragIntensity] = useState(0);
  const [showInstructions, setShowInstructions] = useState(true);
  const constraintsRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Hide instructions after first interaction
  useEffect(() => {
    if (dragDirection) {
      setShowInstructions(false);
    }
  }, [dragDirection]);

  const handleDragEnd = (event: any, info: PanInfo) => {
    const swipeThreshold = 100;
    const swipeVelocityThreshold = 500;
    const dragDistance = Math.abs(info.offset.x);
    const dragVelocity = Math.abs(info.velocity.x);

    if (
      info.offset.x > swipeThreshold ||
      info.velocity.x > swipeVelocityThreshold
    ) {
      // Swipe right - like with enhanced feedback
      onSwipeRight(movies[currentIndex]);
    } else if (
      info.offset.x < -swipeThreshold ||
      info.velocity.x < -swipeVelocityThreshold
    ) {
      // Swipe left - skip with enhanced feedback
      onSwipeLeft();
    }

    setDragDirection(null);
    setDragIntensity(0);
  };

  const handleDrag = (event: any, info: PanInfo) => {
    const intensity = Math.min(Math.abs(info.offset.x) / 150, 1);
    setDragIntensity(intensity);

    if (info.offset.x > 50) {
      setDragDirection("right");
    } else if (info.offset.x < -50) {
      setDragDirection("left");
    } else {
      setDragDirection(null);
    }
  };

  const handleMovieClick = (movie: Movie) => {
    onMovieDetails(movie);
  };

  if (!movies || movies.length === 0 || currentIndex >= movies.length) {
    return (
      <div className="flex items-center justify-center h-96 relative">
        {/* Empty State */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-gray-500 to-slate-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Eye className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-white text-xl font-semibold mb-2">
            No Movies Available
          </h3>
          <p className="text-white/70">
            We're working on finding more great movies for you!
          </p>
        </motion.div>
      </div>
    );
  }

  const currentMovie = movies[currentIndex];
  const nextMovie = movies[currentIndex + 1];
  const nextNextMovie = movies[currentIndex + 2];

  return (
    <div
      className="relative w-full max-w-sm mx-auto h-[600px]"
      ref={constraintsRef}
    >
      {/* Background Cards for Depth */}
      <AnimatePresence>
        {nextNextMovie && (
          <motion.div
            key={`bg-${nextNextMovie.id}`}
            className="absolute inset-0 scale-90 opacity-30"
            initial={{ scale: 0.85, opacity: 0.2, y: 20 }}
            animate={{ scale: 0.9, opacity: 0.3, y: 10 }}
            exit={{ scale: 0.85, opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl border border-white/10" />
          </motion.div>
        )}

        {nextMovie && (
          <motion.div
            key={`next-${nextMovie.id}`}
            className="absolute inset-0 scale-95 opacity-60"
            initial={{ scale: 0.9, opacity: 0.4, y: 15 }}
            animate={{ scale: 0.95, opacity: 0.6, y: 5 }}
            exit={{ scale: 0.9, opacity: 0, y: 15 }}
            transition={{ duration: 0.4 }}
          >
            <MovieCard
              movie={nextMovie}
              onClick={() => {}}
              isDragging={false}
              dragDirection={null}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Current Movie Card */}
      <motion.div
        key={`current-${currentMovie.id}`}
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
        drag="x"
        dragConstraints={constraintsRef}
        dragElastic={0.2}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        animate={{
          rotate:
            dragDirection === "right" ? 5 : dragDirection === "left" ? -5 : 0,
          scale: dragDirection ? 1.02 : 1,
          opacity: 1,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
        whileDrag={{
          scale: 1.05,
          zIndex: 50,
        }}
        initial={{ scale: 0, opacity: 0 }}
        exit={{
          scale: 0.8,
          opacity: 0,
          x:
            dragDirection === "right"
              ? 300
              : dragDirection === "left"
              ? -300
              : 0,
        }}
        style={{
          zIndex: 10,
        }}
      >
        <MovieCard
          movie={currentMovie}
          onClick={handleMovieClick}
          isDragging={!!dragDirection}
          dragDirection={dragDirection}
        />

        {/* Enhanced Swipe Indicators */}
        <AnimatePresence>
          {dragDirection && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 pointer-events-none z-20"
            >
              {/* Side Glow Effects */}
              <div
                className={`absolute inset-y-0 w-20 ${
                  dragDirection === "right" ? "right-0" : "left-0"
                } ${
                  dragDirection === "right"
                    ? "bg-gradient-to-l from-green-500/50 to-transparent"
                    : "bg-gradient-to-r from-red-500/50 to-transparent"
                } blur-xl`}
                style={{ opacity: dragIntensity }}
              />

              {/* Corner Indicators */}
              <motion.div
                className={`absolute top-8 ${
                  dragDirection === "right" ? "right-8" : "left-8"
                } ${
                  dragDirection === "right" ? "bg-green-500" : "bg-red-500"
                } rounded-full p-3 shadow-2xl`}
                initial={{ scale: 0, rotate: -90 }}
                animate={{
                  scale: dragIntensity,
                  rotate: 0,
                }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                {dragDirection === "right" ? (
                  <Heart className="w-6 h-6 text-white fill-white" />
                ) : (
                  <X className="w-6 h-6 text-white" />
                )}
              </motion.div>

              {/* Progress Bars */}
              <motion.div
                className={`absolute bottom-8 ${
                  dragDirection === "right" ? "right-8" : "left-8"
                } w-24 h-2 bg-white/20 rounded-full overflow-hidden`}
              >
                <motion.div
                  className={`h-full ${
                    dragDirection === "right"
                      ? "bg-gradient-to-r from-green-400 to-green-600"
                      : "bg-gradient-to-r from-red-400 to-red-600"
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${dragIntensity * 100}%` }}
                  transition={{ duration: 0.1 }}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Floating Action Hints */}
      <AnimatePresence>
        {showInstructions && !dragDirection && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute -bottom-16 left-0 right-0 z-30"
          >
            <div className="flex justify-center">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-6 py-3">
                <div className="flex items-center gap-4 text-white/80 text-sm">
                  <div className="flex items-center gap-2">
                    <ChevronLeft className="w-4 h-4 text-red-400" />
                    <span>Swipe left to skip</span>
                  </div>
                  <div className="w-px h-4 bg-white/30" />
                  <div className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-green-400" />
                    <span>Swipe right to save</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Indicator */}
      <motion.div
        className="absolute -top-12 left-0 right-0 z-20"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex justify-center">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-full px-4 py-2">
            <div className="flex items-center gap-2 text-white/70 text-sm">
              <Sparkles className="w-4 h-4" />
              <span>
                {currentIndex + 1} of {movies.length}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Undo Gesture Hint */}
      {dragDirection && dragIntensity > 0.7 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
        >
          <div className="bg-white/90 text-gray-900 px-4 py-2 rounded-full font-semibold text-sm shadow-2xl">
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              <span>
                Release to {dragDirection === "right" ? "save" : "skip"}
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Card Stack Depth Indicators */}
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
        {[...Array(Math.min(3, movies.length - currentIndex))].map((_, i) => (
          <motion.div
            key={i}
            className={`w-2 h-2 rounded-full ${
              i === 0 ? "bg-white" : i === 1 ? "bg-white/60" : "bg-white/30"
            }`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.1 }}
          />
        ))}
      </div>
    </div>
  );
};

export default SwipeDeck;
