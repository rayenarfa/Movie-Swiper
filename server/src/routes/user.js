const express = require("express");
const pool = require("../db/pool");
const router = express.Router();

// Get user profile
router.get("/profile/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await pool.query(
      "SELECT id, email, created_at FROM users WHERE id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = result.rows[0];

    // Get user preferences
    const preferencesResult = await pool.query(
      "SELECT activity, mood FROM user_preferences WHERE user_id = $1",
      [userId]
    );

    // Get user stats
    const statsResult = await pool.query(
      "SELECT COUNT(*) as saved_movies_count FROM saved_movies WHERE user_id = $1",
      [userId]
    );

    res.json({
      ...user,
      preferences: preferencesResult.rows[0] || {},
      stats: {
        saved_movies_count: parseInt(statsResult.rows[0].saved_movies_count),
      },
    });
  } catch (error) {
    console.error("❌ Error fetching user profile:", error.message);
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
});

// Update user profile
router.put("/profile/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { email, bio, avatar_url } = req.body;

    // Check if user exists
    const userResult = await pool.query("SELECT id FROM users WHERE id = $1", [
      userId,
    ]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update user profile
    const updateResult = await pool.query(
      "UPDATE users SET email = COALESCE($1, email), updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, email, created_at",
      [email, userId]
    );

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: updateResult.rows[0],
    });
  } catch (error) {
    console.error("❌ Error updating user profile:", error.message);
    res.status(500).json({ error: "Failed to update user profile" });
  }
});

// Get user's saved movies
router.get("/saved/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Skip database query for now - return empty array
    console.log(
      `📚 Saved movies requested for user ${userId} (database disabled)`
    );
    res.json([]);
  } catch (error) {
    console.error("❌ Error fetching saved movies:", error.message);
    // Fallback to empty array if database not available
    res.json([]);
  }
});

// Save a movie to user's favorites
router.post("/saved", async (req, res) => {
  try {
    const { userId, movie } = req.body;

    if (!userId || !movie) {
      return res.status(400).json({ error: "userId and movie are required" });
    }

    // Skip database operations for now - just return success
    console.log(
      `💾 Movie save requested for user ${userId} (database disabled)`
    );
    res.json({
      message: "Movie saved successfully (database disabled)",
      movie,
    });
  } catch (error) {
    console.error("❌ Error saving movie:", error.message);
    res.status(500).json({ error: "Failed to save movie" });
  }
});

// Remove a movie from user's favorites
router.delete("/saved/:userId/:movieId", async (req, res) => {
  try {
    const { userId, movieId } = req.params;

    const result = await pool.query(
      "DELETE FROM saved_movies sm USING movies m WHERE sm.user_id = $1 AND sm.movie_id = m.id AND m.tmdb_id = $2",
      [userId, movieId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Movie not found in saved list" });
    }

    res.json({ message: "Movie removed from saved list" });
  } catch (error) {
    console.error("❌ Error removing movie:", error.message);
    res.status(500).json({ error: "Failed to remove movie from saved list" });
  }
});

// Get user preferences
router.get("/preferences/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await pool.query(
      "SELECT activity, mood FROM user_preferences WHERE user_id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.json({});
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("❌ Error fetching user preferences:", error.message);
    res.json({});
  }
});

// Save user preferences
router.post("/preferences", async (req, res) => {
  try {
    const { userId, activity, mood } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    // Upsert user preferences
    await pool.query(
      `INSERT INTO user_preferences (user_id, activity, mood) 
       VALUES ($1, $2, $3) 
       ON CONFLICT (user_id) 
       DO UPDATE SET activity = $2, mood = $3, updated_at = CURRENT_TIMESTAMP`,
      [userId, activity, mood]
    );

    res.json({
      message: "Preferences saved successfully",
      preferences: { activity, mood },
    });
  } catch (error) {
    console.error("❌ Error saving preferences:", error.message);
    res.status(500).json({ error: "Failed to save preferences" });
  }
});

// Get user recommendations based on viewing history
router.get("/recommendations/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Get user's preferred genres based on saved movies
    const genreResult = await pool.query(
      `SELECT UNNEST(genre_ids) as genre_id, COUNT(*) as count
       FROM movies m
       JOIN saved_movies sm ON m.id = sm.movie_id
       WHERE sm.user_id = $1
       GROUP BY genre_id
       ORDER BY count DESC
       LIMIT 3`,
      [userId]
    );

    const preferredGenres = genreResult.rows.map((row) => row.genre_id);

    // Get user's activity and mood preferences
    const prefResult = await pool.query(
      "SELECT activity, mood FROM user_preferences WHERE user_id = $1",
      [userId]
    );

    const preferences = prefResult.rows[0] || {};

    res.json({
      preferred_genres: preferredGenres,
      activity: preferences.activity,
      mood: preferences.mood,
      recommendation_basis: genreResult.rows,
    });
  } catch (error) {
    console.error("❌ Error generating recommendations:", error.message);
    res.status(500).json({ error: "Failed to generate recommendations" });
  }
});

// Share a movie recommendation with friends
router.post("/share", async (req, res) => {
  try {
    const { userId, movieId, friendEmail, message } = req.body;

    if (!userId || !movieId || !friendEmail) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // In a real app, this would send an email or notification
    // For now, we'll just log it
    console.log(
      `🔗 User ${userId} shared movie ${movieId} with ${friendEmail}: ${message}`
    );

    res.json({
      success: true,
      message: "Movie recommendation shared successfully",
    });
  } catch (error) {
    console.error("❌ Error sharing movie:", error.message);
    res.status(500).json({ error: "Failed to share movie" });
  }
});

// Get user activity feed (for social features)
router.get("/activity/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await pool.query(
      `SELECT 
        'saved_movie' as activity_type,
        m.title as movie_title,
        m.poster_path,
        sm.saved_at as timestamp
       FROM saved_movies sm
       JOIN movies m ON sm.movie_id = m.id
       WHERE sm.user_id = $1
       ORDER BY sm.saved_at DESC
       LIMIT 10`,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("❌ Error fetching user activity:", error.message);
    res.status(500).json({ error: "Failed to fetch user activity" });
  }
});

module.exports = router;
