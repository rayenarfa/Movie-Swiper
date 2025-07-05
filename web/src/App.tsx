import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect } from "react";
import { useSwipeStore } from "./store/useSwipeStore";
import { getCurrentUser } from "./config/supabaseClient";
import { Toaster } from "react-hot-toast";

// Route components
import Auth from "./routes/Auth";
import Activity from "./routes/Onboarding/Activity";
import Mood from "./routes/Onboarding/Mood";
import Loading from "./routes/Loading";
import Swipe from "./routes/Swipe";
import Home from "./routes/Home";
import Saved from "./routes/Saved";
import Profile from "./routes/Profile";
import BottomNav from "./components/BottomNav";
import MovieDetails from "./routes/MovieDetails";

function App() {
  const {
    isAuthenticated,
    setUser,
    selectedActivity,
    selectedMood,
    user,
    isLoading,
  } = useSwipeStore();

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      const user = await getCurrentUser();
      if (user) {
        setUser(user);
      }
    };
    checkAuth();
  }, [setUser]);

  // Protected route wrapper
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!isAuthenticated) {
      return <Navigate to="/auth" replace />;
    }
    return <>{children}</>;
  };

  // Onboarding flow wrapper
  const OnboardingRoute = ({ children }: { children: React.ReactNode }) => {
    if (!isAuthenticated) {
      return <Navigate to="/auth" replace />;
    }
    return <>{children}</>;
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-900">
        <Routes>
          {/* Auth Route */}
          <Route
            path="/auth"
            element={
              isAuthenticated ? <Navigate to="/home" replace /> : <Auth />
            }
          />

          {/* Onboarding Routes */}
          <Route
            path="/onboarding/activity"
            element={
              <OnboardingRoute>
                <Activity />
              </OnboardingRoute>
            }
          />
          <Route
            path="/onboarding/mood"
            element={
              <OnboardingRoute>
                {selectedActivity ? (
                  <Mood />
                ) : (
                  <Navigate to="/onboarding/activity" replace />
                )}
              </OnboardingRoute>
            }
          />
          <Route
            path="/loading"
            element={
              <OnboardingRoute>
                {selectedActivity && selectedMood ? (
                  <Loading />
                ) : (
                  <Navigate to="/onboarding/activity" replace />
                )}
              </OnboardingRoute>
            }
          />
          <Route
            path="/swipe"
            element={
              <ProtectedRoute>
                <div className="pb-20">
                  <Swipe />
                </div>
                <BottomNav />
              </ProtectedRoute>
            }
          />

          {/* Main App Routes */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <div className="pb-20">
                  <Home />
                </div>
                <BottomNav />
              </ProtectedRoute>
            }
          />
          <Route
            path="/saved"
            element={
              <ProtectedRoute>
                <div className="pb-20">
                  <Saved />
                </div>
                <BottomNav />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <div className="pb-20">
                  <Profile />
                </div>
                <BottomNav />
              </ProtectedRoute>
            }
          />
          <Route
            path="/movie/:movieId"
            element={
              <ProtectedRoute>
                <MovieDetails />
              </ProtectedRoute>
            }
          />

          {/* Default Route */}
          <Route path="/" element={user ? <Home /> : <Auth />} />
        </Routes>

        {/* Bottom Navigation - Hide on auth and movie details pages */}
        {user && (
          <Routes>
            <Route path="/auth" element={null} />
            <Route path="/movie/:movieId" element={null} />
            <Route path="*" element={<BottomNav />} />
          </Routes>
        )}

        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#374151",
              color: "#F3F4F6",
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;
