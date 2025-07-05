import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useSwipeStore } from "../../store/useSwipeStore";
import {
  Laugh,
  Brain,
  Heart as HeartBreak,
  Target,
  Heart,
  Map,
  Search,
  Sparkles,
  ChevronRight,
  Smile,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";

const MOODS = [
  {
    id: "funny",
    label: "Funny",
    emoji: "🤣",
    icon: Laugh,
    color: "from-yellow-500 to-orange-500",
  },
  {
    id: "smart",
    label: "Smart",
    emoji: "🧠",
    icon: Brain,
    color: "from-blue-500 to-indigo-500",
  },
  {
    id: "emotional",
    label: "Emotional",
    emoji: "😢",
    icon: HeartBreak,
    color: "from-gray-500 to-slate-500",
  },
  {
    id: "thrilling",
    label: "Thrilling",
    emoji: "🎯",
    icon: Target,
    color: "from-red-500 to-pink-500",
  },
  {
    id: "romantic",
    label: "Romantic",
    emoji: "💕",
    icon: Heart,
    color: "from-pink-500 to-rose-500",
  },
  {
    id: "adventurous",
    label: "Adventurous",
    emoji: "🗺",
    icon: Map,
    color: "from-green-500 to-emerald-500",
  },
  {
    id: "mysterious",
    label: "Mysterious",
    emoji: "🔍",
    icon: Search,
    color: "from-purple-500 to-violet-500",
  },
  {
    id: "uplifting",
    label: "Uplifting",
    emoji: "✨",
    icon: Sparkles,
    color: "from-cyan-500 to-blue-500",
  },
];

const Mood = () => {
  const navigate = useNavigate();
  const { selectedMood, setMood } = useSwipeStore();

  const handleMoodSelect = (moodId: string) => {
    setMood(moodId);
    navigate("/loading");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-pink-900 to-slate-900 flex flex-col items-center justify-center p-6">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-16 h-16 bg-gradient-to-br from-pink-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Smile className="w-8 h-8 text-white" />
          </motion.div>

          <h1 className="text-5xl font-bold text-white mb-4">
            What's your mood?
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Pick the vibe that matches what you're feeling right now and we'll
            find the perfect movie
          </p>
        </div>

        {/* Mood Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {MOODS.map((mood, index) => {
            const IconComponent = mood.icon;
            const isSelected = selectedMood === mood.id;

            return (
              <motion.div
                key={mood.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                    isSelected
                      ? "bg-white/20 border-white/40 shadow-2xl ring-2 ring-white/30"
                      : "bg-white/10 border-white/20 hover:bg-white/15 hover:border-white/30"
                  } backdrop-blur-sm`}
                  onClick={() => handleMoodSelect(mood.id)}
                >
                  <CardContent className="p-6 text-center">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-16 h-16 bg-gradient-to-br ${mood.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}
                    >
                      <IconComponent className="w-8 h-8 text-white" />
                    </motion.div>

                    <h3 className="font-semibold text-white mb-2 text-lg">
                      {mood.label}
                    </h3>

                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mx-auto"
                      >
                        <ChevronRight className="w-4 h-4 text-white" />
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Continue Button */}
        {selectedMood && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Button
              onClick={() => navigate("/loading")}
              className="bg-gradient-to-r from-pink-600 to-orange-600 hover:from-pink-700 hover:to-orange-700 text-white px-8 py-3 rounded-xl font-semibold text-lg shadow-lg"
            >
              Find My Movies
              <Sparkles className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        )}

        {/* Helper Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-8"
        >
          <p className="text-white/50 text-sm">
            Choose the vibe that fits your current mood
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Mood;
