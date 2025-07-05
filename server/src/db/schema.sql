-- MovieSwiper Database Schema

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Movies table
CREATE TABLE movies (
    id SERIAL PRIMARY KEY,
    tmdb_id INTEGER UNIQUE,
    title VARCHAR(255) NOT NULL,
    overview TEXT,
    poster_path VARCHAR(255),
    release_date DATE,
    vote_average DECIMAL(3,1),
    genre_ids INTEGER[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Saved movies table (user favorites)
CREATE TABLE saved_movies (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    movie_id INTEGER REFERENCES movies(id) ON DELETE CASCADE,
    saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, movie_id)
);

-- User preferences table
CREATE TABLE user_preferences (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    activity VARCHAR(50),
    mood VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- Tags table for movie categorization
CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(50) -- 'activity', 'mood', 'genre', etc.
);

-- Movie tags junction table
CREATE TABLE movie_tags (
    id SERIAL PRIMARY KEY,
    movie_id INTEGER REFERENCES movies(id) ON DELETE CASCADE,
    tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
    UNIQUE(movie_id, tag_id)
);

-- Indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_saved_movies_user_id ON saved_movies(user_id);
CREATE INDEX idx_saved_movies_movie_id ON saved_movies(movie_id);
CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX idx_movie_tags_movie_id ON movie_tags(movie_id);
CREATE INDEX idx_movie_tags_tag_id ON movie_tags(tag_id);

-- Insert some sample tags
INSERT INTO tags (name, category) VALUES 
('action', 'genre'),
('comedy', 'genre'),
('drama', 'genre'),
('thriller', 'genre'),
('romance', 'genre'),
('sci-fi', 'genre'),
('horror', 'genre'),
('adventure', 'genre'),
('gym', 'activity'),
('eating', 'activity'),
('cant-sleep', 'activity'),
('commuting', 'activity'),
('relaxing', 'activity'),
('working', 'activity'),
('date-night', 'activity'),
('friends', 'activity'),
('funny', 'mood'),
('smart', 'mood'),
('emotional', 'mood'),
('thrilling', 'mood'),
('romantic', 'mood'),
('adventurous', 'mood'),
('mysterious', 'mood'),
('uplifting', 'mood');

-- Insert sample movies
INSERT INTO movies (tmdb_id, title, overview, poster_path, release_date, vote_average, genre_ids) VALUES 
(278, 'The Shawshank Redemption', 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.', '/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg', '1994-09-23', 8.7, ARRAY[18]),
(238, 'The Godfather', 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.', '/3bhkrj58Vtu7enYsRolD1fZdja1.jpg', '1972-03-24', 8.7, ARRAY[18, 80]),
(155, 'The Dark Knight', 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.', '/qJ2tW6WMUDux911r6m7haRef0WH.jpg', '2008-07-18', 9.0, ARRAY[28, 18, 80]),
(680, 'Pulp Fiction', 'A burger-loving hit man, his philosophical partner, a drug-addled gangster''s moll and a washed-up boxer converge in this sprawling, comedic crime caper.', '/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg', '1994-09-10', 8.9, ARRAY[80, 18]),
(13, 'Forrest Gump', 'A man with a low IQ has accomplished great things in his life and been present during significant historic events—in each case, far exceeding what anyone imagined he could do.', '/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg', '1994-06-23', 8.8, ARRAY[35, 18, 10749]);

-- Functions for easier querying
CREATE OR REPLACE FUNCTION get_movie_recommendations(
    p_activity VARCHAR(50),
    p_mood VARCHAR(50),
    p_limit INTEGER DEFAULT 10
) RETURNS TABLE (
    id INTEGER,
    title VARCHAR(255),
    overview TEXT,
    poster_path VARCHAR(255),
    release_date DATE,
    vote_average DECIMAL(3,1),
    genre_ids INTEGER[]
) AS $$
BEGIN
    RETURN QUERY
    SELECT m.id, m.title, m.overview, m.poster_path, m.release_date, m.vote_average, m.genre_ids
    FROM movies m
    JOIN movie_tags mt ON m.id = mt.movie_id
    JOIN tags t ON mt.tag_id = t.id
    WHERE t.name IN (p_activity, p_mood)
    GROUP BY m.id, m.title, m.overview, m.poster_path, m.release_date, m.vote_average, m.genre_ids
    ORDER BY RANDOM()
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql; 