import { motion } from "framer-motion";

interface MoodButtonProps {
  mood: {
    id: string;
    label: string;
    emoji: string;
  };
  isSelected: boolean;
  onClick: () => void;
}

const MoodButton = ({ mood, isSelected, onClick }: MoodButtonProps) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        w-full p-6 rounded-2xl font-medium text-lg transition-all duration-200
        ${
          isSelected
            ? "bg-white text-pink-600 shadow-lg"
            : "bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
        }
      `}
    >
      <div className="flex flex-col items-center space-y-2">
        <span className="text-3xl">{mood.emoji}</span>
        <span className="font-semibold">
          {mood.label.split(" ").slice(1).join(" ")}
        </span>
      </div>
    </motion.button>
  );
};

export default MoodButton;
