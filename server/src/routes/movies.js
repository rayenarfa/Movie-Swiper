const express = require("express");
const axios = require("axios");
const pool = require("../db/pool");
const router = express.Router();

// TMDB API configuration
const TMDB_API_KEY =
  process.env.TMDB_API_KEY || "de5b23003a6a04db8b00bab2340ecf81";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

// Helper function to store movie in database
async function storeMovieInDB(movieData) {
  try {
    const {
      id: tmdb_id,
      title,
      overview,
      poster_path,
      release_date,
      vote_average,
      genre_ids,
    } = movieData;

    // Check if movie already exists
    const existingMovie = await pool.query(
      "SELECT id FROM movies WHERE tmdb_id = $1",
      [tmdb_id]
    );

    if (existingMovie.rows.length > 0) {
      return existingMovie.rows[0].id;
    }

    // Insert new movie
    const result = await pool.query(
      "INSERT INTO movies (tmdb_id, title, overview, poster_path, release_date, vote_average, genre_ids) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id",
      [
        tmdb_id,
        title,
        overview,
        poster_path,
        release_date,
        vote_average,
        genre_ids,
      ]
    );

    return result.rows[0].id;
  } catch (error) {
    console.error("Error storing movie in database:", error);
    return null;
  }
}

// Get movie recommendations based on activity and mood
router.get("/recommendations", async (req, res) => {
  try {
    const { activity, mood, year, rating, duration } = req.query;

    if (!activity || !mood) {
      return res.status(400).json({ error: "Activity and mood are required" });
    }

    console.log(`🎬 Fetching movies for activity: ${activity}, mood: ${mood}`);

    // Skip database query for now and use TMDB API directly
    console.log("🔄 Using TMDB API for movie recommendations");

    // Enhanced genre mapping
    const genreMap = {
      gym: [28, 12], // Action, Adventure
      eating: [35, 10751], // Comedy, Family
      "cant-sleep": [53, 27], // Thriller, Horror
      commuting: [35, 18], // Comedy, Drama
      relaxing: [10749, 35], // Romance, Comedy
      working: [18, 35], // Drama, Comedy
      "date-night": [10749, 35], // Romance, Comedy
      friends: [35, 12], // Comedy, Adventure
      funny: [35], // Comedy
      smart: [18, 878], // Drama, Sci-Fi
      emotional: [18, 10749], // Drama, Romance
      thrilling: [53, 28], // Thriller, Action
      romantic: [10749], // Romance
      adventurous: [12, 28], // Adventure, Action
      mysterious: [9648, 53], // Mystery, Thriller
      uplifting: [35, 10751], // Comedy, Family
    };

    const activityGenres = genreMap[activity] || [18];
    const moodGenres = genreMap[mood] || [35];
    const allGenres = [...activityGenres, ...moodGenres];

    // Build query parameters for advanced filtering
    const params = {
      api_key: TMDB_API_KEY,
      with_genres: allGenres.join(","),
      sort_by: "vote_average.desc",
      "vote_count.gte": 100,
      page: Math.floor(Math.random() * 5) + 1,
    };

    // Add year filter if provided
    if (year) {
      params.year = year;
    }

    // Add rating filter if provided
    if (rating) {
      params["vote_average.gte"] = rating;
    }

    // Add duration filter if provided (runtime in minutes)
    if (duration) {
      const [min, max] = duration.split("-");
      if (min) params["with_runtime.gte"] = min;
      if (max) params["with_runtime.lte"] = max;
    }

    const response = await axios.get(`${TMDB_BASE_URL}/discover/movie`, {
      params,
    });

    const movies = response.data.results.slice(0, 20);

    // Skip database storage for now
    // for (const movie of movies) {
    //   await storeMovieInDB(movie);
    // }

    console.log(`✅ Successfully fetched ${movies.length} movies from TMDB`);
    res.json(movies);
  } catch (error) {
    console.error("❌ Error fetching movie recommendations:", error.message);
    res.status(500).json({ error: "Failed to fetch movie recommendations" });
  }
});

// Get movie details with enhanced information
router.get("/:movieId", async (req, res) => {
  try {
    const { movieId } = req.params;

    // Skip database query for now - go straight to TMDB
    console.log("🔄 Database not available, fetching from TMDB");

    // Fetch from TMDB with enhanced details
    const [movieResponse, creditsResponse, videosResponse] = await Promise.all([
      axios.get(`${TMDB_BASE_URL}/movie/${movieId}`, {
        params: { api_key: TMDB_API_KEY },
      }),
      axios.get(`${TMDB_BASE_URL}/movie/${movieId}/credits`, {
        params: { api_key: TMDB_API_KEY },
      }),
      axios.get(`${TMDB_BASE_URL}/movie/${movieId}/videos`, {
        params: { api_key: TMDB_API_KEY },
      }),
    ]);

    const movie = {
      ...movieResponse.data,
      credits: creditsResponse.data,
      videos: videosResponse.data,
    };

    // Skip database storage for now
    // await storeMovieInDB(movieResponse.data);

    res.json(movie);
  } catch (error) {
    console.error(
      `❌ Error fetching movie ${req.params.movieId}:`,
      error.message
    );
    res.status(500).json({ error: "Failed to fetch movie details" });
  }
});

// Save movie to favorites (database)
router.post("/favorites", async (req, res) => {
  try {
    const { userId, movieId, movieData } = req.body;

    if (!userId || !movieId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Store movie in database if not exists
    let dbMovieId = movieId;
    if (movieData) {
      dbMovieId = await storeMovieInDB(movieData);
    }

    // Check if user exists
    const userResult = await pool.query("SELECT id FROM users WHERE id = $1", [
      userId,
    ]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Save to favorites
    await pool.query(
      "INSERT INTO saved_movies (user_id, movie_id) VALUES ($1, $2) ON CONFLICT (user_id, movie_id) DO NOTHING",
      [userId, dbMovieId]
    );

    console.log(`💾 Movie ${movieId} saved to database for user ${userId}`);
    res.json({ success: true, message: "Movie saved to favorites" });
  } catch (error) {
    console.error("❌ Error saving movie to favorites:", error.message);
    res.status(500).json({ error: "Failed to save movie" });
  }
});

// Get user's saved movies
router.get("/favorites/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await pool.query(
      `SELECT m.*, sm.saved_at 
       FROM movies m 
       JOIN saved_movies sm ON m.id = sm.movie_id 
       WHERE sm.user_id = $1 
       ORDER BY sm.saved_at DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("❌ Error fetching saved movies:", error.message);
    res.status(500).json({ error: "Failed to fetch saved movies" });
  }
});

// Remove movie from favorites
router.delete("/favorites/:userId/:movieId", async (req, res) => {
  try {
    const { userId, movieId } = req.params;

    await pool.query(
      "DELETE FROM saved_movies WHERE user_id = $1 AND movie_id = $2",
      [userId, movieId]
    );

    res.json({ success: true, message: "Movie removed from favorites" });
  } catch (error) {
    console.error("❌ Error removing movie from favorites:", error.message);
    res.status(500).json({ error: "Failed to remove movie from favorites" });
  }
});

module.exports = router;
