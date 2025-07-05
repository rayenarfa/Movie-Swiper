import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSwipeStore } from "../store/useSwipeStore";
import { Sparkles, Film, Brain, Search, Star, Play } from "lucide-react";

const Loading = () => {
  const navigate = useNavigate();
  const { selectedActivity, selectedMood, setMovies, currentMovies } =
    useSwipeStore();
  const [hasLoaded, setHasLoaded] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const loadingSteps = [
    { icon: Search, text: "Analyzing your preferences", delay: 500 },
    { icon: Brain, text: "Processing mood signals", delay: 800 },
    { icon: Film, text: "Curating perfect matches", delay: 1000 },
    { icon: Star, text: "Finalizing recommendations", delay: 1200 },
  ];

  useEffect(() => {
    // Redirect if missing activity or mood
    if (!selectedActivity || !selectedMood) {
      navigate("/onboarding/activity");
      return;
    }

    // If we already have movies, go directly to swipe
    if (currentMovies.length > 0 && !hasLoaded) {
      setHasLoaded(true);
      setTimeout(() => {
        navigate("/swipe");
      }, 1000);
      return;
    }

    // Animated loading sequence
    if (currentMovies.length === 0 && !hasLoaded) {
      setHasLoaded(true);

      // Progress animation
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 2;
        });
      }, 50);

      // Step animations
      loadingSteps.forEach((step, index) => {
        setTimeout(() => {
          setLoadingStep(index);
        }, step.delay);
      });

      const sampleMovies = [
        {
          id: 1,
          title: "The Shawshank Redemption",
          overview:
            "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
          poster_path: "/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
          release_date: "1994-09-23",
          vote_average: 9.3,
          genre_ids: [18],
        },
        {
          id: 2,
          title: "The Godfather",
          overview:
            "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
          poster_path: "/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
          release_date: "1972-03-24",
          vote_average: 9.2,
          genre_ids: [18, 80],
        },
        {
          id: 3,
          title: "The Dark Knight",
          overview:
            "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
          poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
          release_date: "2008-07-18",
          vote_average: 9.0,
          genre_ids: [28, 18, 80],
        },
        {
          id: 4,
          title: "Pulp Fiction",
          overview:
            "A burger-loving hit man, his philosophical partner, a drug-addled gangster's moll and a washed-up boxer converge in this sprawling, comedic crime caper.",
          poster_path: "/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
          release_date: "1994-09-10",
          vote_average: 8.9,
          genre_ids: [80, 18],
        },
        {
          id: 5,
          title: "Forrest Gump",
          overview:
            "A man with a low IQ has accomplished great things in his life and been present during significant historic events—in each case, far exceeding what anyone imagined he could do.",
          poster_path: "/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
          release_date: "1994-06-23",
          vote_average: 8.8,
          genre_ids: [35, 18, 10749],
        },
      ];

      console.log("🎬 Loading sample movies for demo");
      setMovies(sampleMovies);

      setTimeout(() => {
        navigate("/swipe");
      }, 3500);
    }
  }, [selectedActivity, selectedMood, currentMovies.length, hasLoaded]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 flex flex-col justify-center items-center p-6">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center relative z-10 max-w-2xl"
      >
        {/* Main Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <div className="relative mx-auto w-32 h-32">
            {/* Outer spinning ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border-4 border-gradient-to-r from-purple-500 to-pink-500 border-t-transparent"
              style={{
                background: `conic-gradient(from 0deg, transparent, #8b5cf6, #ec4899, transparent)`,
                borderRadius: "50%",
                padding: "4px",
              }}
            />

            {/* Inner icon */}
            <div className="absolute inset-4 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center shadow-2xl">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-12 h-12 text-white" />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-5xl font-bold text-white mb-4"
        >
          Crafting Your Perfect Picks
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-xl text-white/70 mb-12"
        >
          Our AI is analyzing your preferences to find movies you'll absolutely
          love
        </motion.p>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mb-8"
        >
          <div className="w-full bg-white/10 rounded-full h-3 mb-4 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-lg"
            />
          </div>
          <p className="text-white/60 text-sm">{progress}% Complete</p>
        </motion.div>

        {/* Loading Steps */}
        <div className="space-y-4 mb-8">
          <AnimatePresence mode="wait">
            {loadingSteps.map((step, index) => {
              const IconComponent = step.icon;
              const isActive = loadingStep >= index;
              const isCurrent = loadingStep === index;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{
                    opacity: isActive ? 1 : 0.5,
                    x: 0,
                    scale: isCurrent ? 1.05 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                  className={`flex items-center gap-4 p-4 rounded-xl backdrop-blur-sm ${
                    isActive
                      ? "bg-white/20 border border-white/30"
                      : "bg-white/10 border border-white/20"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isActive
                        ? "bg-gradient-to-r from-purple-500 to-pink-500"
                        : "bg-white/20"
                    }`}
                  >
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-white font-medium">{step.text}</span>
                  {isCurrent && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="ml-auto"
                    >
                      <div className="w-2 h-2 bg-green-400 rounded-full" />
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Selected Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.0 }}
          className="grid grid-cols-2 gap-4"
        >
          <div className="p-4 rounded-xl bg-white/10 border border-white/20 backdrop-blur-sm">
            <p className="text-white/60 text-sm mb-1">Activity</p>
            <p className="text-white font-semibold capitalize">
              {selectedActivity?.replace("-", " ")}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-white/10 border border-white/20 backdrop-blur-sm">
            <p className="text-white/60 text-sm mb-1">Mood</p>
            <p className="text-white font-semibold capitalize">
              {selectedMood}
            </p>
          </div>
        </motion.div>

        {/* Final Message */}
        {progress >= 90 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8 p-6 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <Play className="w-5 h-5 text-green-400" />
              <span className="text-green-400 font-semibold">
                Ready to Swipe!
              </span>
            </div>
            <p className="text-white/70 text-sm">
              Your personalized movie collection is ready
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Loading;
