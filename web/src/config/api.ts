// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const apiConfig = {
  baseURL: API_BASE_URL,
  endpoints: {
    movies: {
      recommendations: "/api/movies/recommendations",
      details: "/api/movies",
    },
    user: {
      profile: "/api/user/profile",
      activity: "/api/user/activity",
      recommendations: "/api/user/recommendations",
      saved: "/api/user/saved",
      share: "/api/user/share",
    },
    health: "/health",
  },
};

// Helper function to build full URLs
export const buildApiUrl = (
  endpoint: string,
  params?: Record<string, string>
) => {
  const url = new URL(endpoint, API_BASE_URL);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }

  return url.toString();
};

export default apiConfig;
