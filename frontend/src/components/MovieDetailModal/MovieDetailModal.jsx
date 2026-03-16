import './MovieDetailModal.css';

const MovieDetailModal = ({ movie, onClose }) => {
  if (!movie) return null;

  const posterPath = movie?.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://placehold.co/300x450?text=No+Poster';
  const rating = Number(movie?.rating ?? movie?.vote_average ?? 0).toFixed(1);
  const releaseDate = movie?.release_date ? new Date(movie.release_date).getFullYear() : 'Unknown';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <div className="modal-body">
          <img src={posterPath} alt={movie?.title || 'Movie poster'} />
          <div className="modal-info">
            <h2>{movie?.title || 'Untitled'}</h2>
            <p><strong>Rating:</strong> ★ {rating}</p>
            <p><strong>Year:</strong> {releaseDate}</p>
            <p><strong>Language:</strong> {movie?.original_language?.toUpperCase() || 'N/A'}</p>
            <p className="modal-overview">{movie?.overview || 'No description available.'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailModal;