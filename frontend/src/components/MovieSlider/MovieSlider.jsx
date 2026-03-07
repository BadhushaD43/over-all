import MovieCard from '../MovieCard/MovieCard';
import './MovieSlider.css';

const MovieSlider = ({ title, movies }) => {
  return (
    <div className="movie-row">
      <h2>{title}</h2>
      <div className="movie-slider">
        {movies?.map(movie => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default MovieSlider;
