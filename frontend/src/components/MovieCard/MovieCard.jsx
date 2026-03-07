import { Link } from 'react-router-dom';
import './MovieCard.css';

const MovieCard = ({ movie, language = 'English', onAddWatchlist }) => {
  const posterPath = movie?.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://placehold.co/300x450?text=No+Poster';
  const rating = movie.vote_average || movie.rating || 'N/A';
  const year = movie.release_date ? movie.release_date.split('-')[0] : 'TBA';

  return (
    <div className="movie-card">
      <Link to={`/movie/${movie.id}?lang=${encodeURIComponent(language)}`} className="movie-link">
        <img src={posterPath} alt={movie.title} />
      </Link>
      <div className="movie-info">
        <h3>{movie.title}</h3>
        <p>Rating: {rating}</p>
        <p>{year}</p>
        <button className="watchlist-small-btn" onClick={() => onAddWatchlist?.(movie)}>
          Add to Watchlist
        </button>
      </div>
    </div>
  );
};

export default MovieCard;

