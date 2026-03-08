import { useRef } from 'react';
import MovieCard from '../MovieCard/MovieCard';
import './MovieSlider.css';

const MovieSlider = ({ title, movies, onMovieClick }) => {
  const sliderRef = useRef(null);

  const scroll = (direction) => {
    const { current } = sliderRef;
    if (current) {
      const scrollAmount = direction === 'left' ? -800 : 800;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="movie-slider">
      <h2>{title}</h2>
      <div className="slider-container">
        <button className="slider-btn left" onClick={() => scroll('left')}>‹</button>
        <div className="slider-content" ref={sliderRef}>
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} onViewDetails={onMovieClick} />
          ))}
        </div>
        <button className="slider-btn right" onClick={() => scroll('right')}>›</button>
      </div>
    </div>
  );
};

export default MovieSlider;
