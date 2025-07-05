import React, { useState } from "react";
import { motion } from "framer-motion";

interface FilterOptions {
  year?: string;
  rating?: string;
  duration?: string;
}

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterOptions) => void;
  currentFilters: FilterOptions;
}

const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  onApply,
  currentFilters,
}) => {
  const [filters, setFilters] = useState<FilterOptions>(currentFilters);

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({});
    onApply({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Filter Movies</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          {/* Year Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Release Year
            </label>
            <select
              value={filters.year || ""}
              onChange={(e) =>
                setFilters({ ...filters, year: e.target.value || undefined })
              }
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
            >
              <option value="">Any year</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
              <option value="2021">2021</option>
              <option value="2020">2020</option>
              <option value="2019">2019</option>
              <option value="2018">2018</option>
              <option value="2017">2017</option>
              <option value="2016">2016</option>
              <option value="2015">2015</option>
              <option value="2010">2010-2014</option>
              <option value="2000">2000-2009</option>
              <option value="1990">1990-1999</option>
              <option value="1980">1980-1989</option>
              <option value="1970">Before 1980</option>
            </select>
          </div>

          {/* Rating Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Minimum Rating
            </label>
            <select
              value={filters.rating || ""}
              onChange={(e) =>
                setFilters({ ...filters, rating: e.target.value || undefined })
              }
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
            >
              <option value="">Any rating</option>
              <option value="8.0">8.0+ (Excellent)</option>
              <option value="7.0">7.0+ (Very Good)</option>
              <option value="6.0">6.0+ (Good)</option>
              <option value="5.0">5.0+ (Average)</option>
              <option value="4.0">4.0+ (Below Average)</option>
            </select>
          </div>

          {/* Duration Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Duration (minutes)
            </label>
            <select
              value={filters.duration || ""}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  duration: e.target.value || undefined,
                })
              }
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
            >
              <option value="">Any duration</option>
              <option value="0-90">Short (0-90 min)</option>
              <option value="90-120">Medium (90-120 min)</option>
              <option value="120-150">Long (120-150 min)</option>
              <option value="150-180">Very Long (150-180 min)</option>
              <option value="180-300">Epic (180+ min)</option>
            </select>
          </div>

          {/* Current Filters Display */}
          {(filters.year || filters.rating || filters.duration) && (
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-300 mb-2">
                Active Filters:
              </h3>
              <div className="flex flex-wrap gap-2">
                {filters.year && (
                  <span className="bg-purple-600 text-white px-2 py-1 rounded-full text-sm">
                    Year: {filters.year}
                  </span>
                )}
                {filters.rating && (
                  <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-sm">
                    Rating: {filters.rating}+
                  </span>
                )}
                {filters.duration && (
                  <span className="bg-green-600 text-white px-2 py-1 rounded-full text-sm">
                    Duration: {filters.duration} min
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-8">
          <button
            onClick={handleReset}
            className="flex-1 bg-gray-600 text-white py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
          >
            Reset All
          </button>
          <button
            onClick={handleApply}
            className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default FilterModal;
