import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useSwipeStore } from "../../store/useSwipeStore";
import {
  Dumbbell,
  UtensilsCrossed,
  Moon,
  Car,
  Sofa,
  Laptop,
  Heart,
  Users,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";

const ACTIVITIES = [
  {
    id: "gym",
    label: "Gym",
    emoji: "💪",
    icon: Dumbbell,
    color: "from-red-500 to-orange-500",
  },
  {
    id: "eating",
    label: "Eating",
    emoji: "🍽",
    icon: UtensilsCrossed,
    color: "from-green-500 to-emerald-500",
  },
  {
    id: "cant-sleep",
    label: "Can't Sleep",
    emoji: "🛏",
    icon: Moon,
    color: "from-indigo-500 to-purple-500",
  },
  {
    id: "commuting",
    label: "Commuting",
    emoji: "🚗",
    icon: Car,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "relaxing",
    label: "Relaxing",
    emoji: "🛋",
    icon: Sofa,
    color: "from-pink-500 to-rose-500",
  },
  {
    id: "working",
    label: "Working",
    emoji: "💻",
    icon: Laptop,
    color: "from-gray-500 to-slate-500",
  },
  {
    id: "date-night",
    label: "Date Night",
    emoji: "💕",
    icon: Heart,
    color: "from-red-500 to-pink-500",
  },
  {
    id: "friends",
    label: "With Friends",
    emoji: "👥",
    icon: Users,
    color: "from-yellow-500 to-orange-500",
  },
];

const Activity = () => {
  const navigate = useNavigate();
  const { selectedActivity, setActivity } = useSwipeStore();

  const handleActivitySelect = (activityId: string) => {
    setActivity(activityId);
    navigate("/onboarding/mood");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex flex-col items-center justify-center p-6">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
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
            className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Sparkles className="w-8 h-8 text-white" />
          </motion.div>

          <h1 className="text-5xl font-bold text-white mb-4">
            What's your vibe?
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Tell us what you're up to so we can find the perfect movie to match
            your current activity
          </p>
        </div>

        {/* Activity Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {ACTIVITIES.map((activity, index) => {
            const IconComponent = activity.icon;
            const isSelected = selectedActivity === activity.id;

            return (
              <motion.div
                key={activity.id}
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
                  onClick={() => handleActivitySelect(activity.id)}
                >
                  <CardContent className="p-6 text-center">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-16 h-16 bg-gradient-to-br ${activity.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}
                    >
                      <IconComponent className="w-8 h-8 text-white" />
                    </motion.div>

                    <h3 className="font-semibold text-white mb-2 text-lg">
                      {activity.label}
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
        {selectedActivity && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Button
              onClick={() => navigate("/onboarding/mood")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold text-lg shadow-lg"
            >
              Continue to Mood
              <ChevronRight className="w-5 h-5 ml-2" />
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
            Choose the activity that best describes your current situation
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Activity;
