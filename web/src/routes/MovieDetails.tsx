import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSwipeStore } from '../store/useSwipeStore';

interface MovieDetailsProps {
  movie?: any;
}

interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

interface Crew {
  id: number;
  name: string;
  job: string;
  profile_path: string | null;
}

interface Video {
  id: string;
  key: string;
  name: string;
  type: string;
  site: string;
}

interface EnhancedMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  runtime: number;
  genres: { id: number; name: string }[];
  production_companies: { id: number; name: string; logo_path: string }[];
  credits: {
    cast: Cast[];
    crew: Crew[];
  };
  videos: {
    results: Video[];
  };
}

const MovieDetails: React.FC<MovieDetailsProps> = ({ movie: propMovie }) => {
  const { movieId } = useParams<{ movieId: string }>();
  const navigate = useNavigate();
  const { savedMovies, addSavedMovie, removeSavedMovie } = useSwipeStore();
  
  const [movie, setMovie] = useState<EnhancedMovie | null>(propMovie || null);
  const [loading, setLoading] = useState(!propMovie);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (movieId && !propMovie) {
      fetchMovieDetails();
    }
  }, [movieId, propMovie]);

  useEffect(() => {
    if (movie) {
      setIsSaved(savedMovies.some(savedMovie => savedMovie.id === movie.id));
    }
  }, [movie, savedMovies]);

  const fetchMovieDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/movies/${movieId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch movie details');
      }
      
      const movieData = await response.json();
      setMovie(movieData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch movie details');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToggle = () => {
    if (!movie) return;
    
    if (isSaved) {
      removeSavedMovie(movie.id);
    } else {
      addSavedMovie(movie);
    }
  };

  const handleShare = () => {
    if (movie && navigator.share) {
      navigator.share({
        title: movie.title,
        text: `Check out this movie: ${movie.title}`,
        url: window.location.href,
      });
    } else if (movie) {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Movie link copied to clipboard!');
    }
  };

  const getDirector = () => {
    if (!movie?.credits?.crew) return null;
    return movie.credits.crew.find(person => person.job === 'Director');
  };

  const getTrailer = () => {
    if (!movie?.videos?.results) return null;
    return movie.videos.results.find(video => 
      video.type === 'Trailer' && video.site === 'YouTube'
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-lg">Loading movie details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button 
            onClick={() => navigate(-1)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-lg">Movie not found</div>
      </div>
    );
  }

  const director = getDirector();
  const trailer = getTrailer();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="relative">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 z-10 bg-black bg-opacity-50 rounded-full p-2"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <button
            onClick={handleShare}
            className="bg-black bg-opacity-50 rounded-full p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
          </svg>
          </button>
          
          <button
            onClick={handleSaveToggle}
            className={`rounded-full p-2 ${isSaved ? 'bg-red-600' : 'bg-black bg-opacity-50'}`}
          >
            <svg className="w-6 h-6" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>

        {/* Backdrop */}
        <div className="relative h-64 overflow-hidden">
          <img
            src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
        </div>
      </div>

      {/* Movie Info */}
      <div className="px-4 -mt-20 relative z-10">
        <div className="flex gap-4 mb-4">
          <img
            src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
            alt={movie.title}
            className="w-32 h-48 object-cover rounded-lg shadow-lg"
          />
          
          <div className="flex-1 pt-8">
            <h1 className="text-2xl font-bold mb-2">{movie.title}</h1>
            <div className="flex items-center gap-4 mb-2">
              <span className="bg-yellow-500 text-black px-2 py-1 rounded text-sm font-semibold">
                ⭐ {movie.vote_average.toFixed(1)}
              </span>
              <span className="text-gray-400">{movie.vote_count} votes</span>
            </div>
            <p className="text-gray-400 mb-2">{new Date(movie.release_date).getFullYear()}</p>
            {movie.runtime && (
              <p className="text-gray-400 mb-2">{movie.runtime} min</p>
            )}
            {director && (
              <p className="text-gray-400">Directed by {director.name}</p>
            )}
          </div>
        </div>

        {/* Genres */}
        <div className="flex flex-wrap gap-2 mb-4">
          {movie.genres?.map(genre => (
            <span
              key={genre.id}
              className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm"
            >
              {genre.name}
            </span>
          ))}
        </div>

        {/* Overview */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Overview</h2>
          <p className="text-gray-300 leading-relaxed">{movie.overview}</p>
        </div>

        {/* Trailer */}
        {trailer && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Trailer</h2>
            <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden">
              <iframe
                src={`https://www.youtube.com/embed/${trailer.key}`}
                title={trailer.name}
                className="w-full h-full"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* Cast */}
        {movie.credits?.cast && movie.credits.cast.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Cast</h2>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {movie.credits.cast.slice(0, 10).map(person => (
                <div key={person.id} className="flex-shrink-0 w-24 text-center">
                  <img
                    src={person.profile_path 
                      ? `https://image.tmdb.org/t/p/w185${person.profile_path}`
                      : '/placeholder-avatar.png'
                    }
                    alt={person.name}
                    className="w-20 h-20 rounded-full object-cover mx-auto mb-2"
                  />
                  <p className="text-sm font-medium">{person.name}</p>
                  <p className="text-xs text-gray-400">{person.character}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Production Companies */}
        {movie.production_companies && movie.production_companies.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Production</h2>
            <div className="flex flex-wrap gap-2">
              {movie.production_companies.map(company => (
                <span
                  key={company.id}
                  className="bg-gray-800 text-gray-300 px-3 py-1 rounded text-sm"
                >
                  {company.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetails; 