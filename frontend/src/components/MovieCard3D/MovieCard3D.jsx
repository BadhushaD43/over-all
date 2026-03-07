import { Link } from 'react-router-dom';
import './MovieCard3D.css';

const MovieCard3D = ({ movie, language = 'English' }) => {
  const posterPath = movie?.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://placehold.co/300x450?text=No+Poster';
  const rating = movie.vote_average || movie.rating || 'N/A';

  return (
    <div className="movie-card-3d">
      <Link to={`/movie/${movie.id}?lang=${encodeURIComponent(language)}`} className="card-inner">
        <div className="card-front">
          <img src={posterPath} alt={movie.title} />
          <div className="card-overlay">
            <div className="rating-badge">{rating}</div>
          </div>
        </div>
        <div className="card-back">
          <h3>{movie.title}</h3>
          <p className="overview">{movie.overview || 'No description available'}</p>
          <div className="card-footer">
            <span className="year">{movie.release_date?.split('-')[0] || 'TBA'}</span>
            <span className="rating-text">★ {rating}</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MovieCard3D;
