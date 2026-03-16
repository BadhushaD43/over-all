import { useState } from 'react';
import { addWatchlist } from '../../services/api';
import './MovieCard.css';

const MovieCard = ({ movie, onViewDetails }) => {
  const [isSaving, setIsSaving] = useState(false);

  const posterPath = movie?.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://placehold.co/300x450?text=No+Poster';
  const rating = Number(movie?.rating ?? movie?.vote_average ?? 0).toFixed(1);
  const releaseDate = movie?.release_date ? new Date(movie.release_date).getFullYear() : 'Unknown';
  const language = movie?.original_language?.toUpperCase() || 'N/A';
  const overview = movie?.overview
    ? movie.overview.slice(0, 150) + (movie.overview.length > 150 ? '...' : '')
    : 'No description available.';

  const handleAddWatchlist = async () => {
    if (!movie?.id || isSaving) return;
    try {
      setIsSaving(true);
      await addWatchlist(movie);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCardClick = () => {
    if (onViewDetails) {
      onViewDetails(movie);
      return;
    }
    handleAddWatchlist();
  };

  return (
    <div className="movie-card" onClick={handleCardClick} title="Click to view details">
      <div className="movie-card-inner">
        <div className="movie-card-face movie-card-front">
          <img src={posterPath} alt={movie?.title || 'Movie poster'} loading="lazy" />
          <div className="movie-card-info">
            <h3>{movie?.title || 'Untitled'}</h3>
            <p>★ {rating}</p>
            <span className="watchlist-hint">{isSaving ? 'Adding...' : 'Add to Watchlist'}</span>
          </div>
        </div>
        <div className="movie-card-face movie-card-back">
          <h3>{movie?.title || 'Untitled'}</h3>
          <p><strong>Rating:</strong> ★ {rating}</p>
          <p><strong>Year:</strong> {releaseDate}</p>
          <p><strong>Language:</strong> {language}</p>
          <p className="movie-overview">{overview}</p>
          <span className="watchlist-hint">{isSaving ? 'Adding...' : 'Click to save'}</span>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
