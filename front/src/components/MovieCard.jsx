import { useNavigate } from "react-router-dom";
import "./MovieCard.css";

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  
  if (!movie) return null;
  
  return (
    <div className="card" onClick={() => navigate(`/movie/${movie.id}`)}>
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
      />
      <h3>{movie.title}</h3>
      <p>⭐ {movie.vote_average?.toFixed(1) || 0}</p>
      <p>{movie.overview?.slice(0, 100)}...</p>
    </div>
  );
};

export default MovieCard;