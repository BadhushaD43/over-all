import { useState, useEffect, useRef } from 'react';
import MovieCard3D from '../MovieCard3D/MovieCard3D';
import SearchBar from '../SearchBar/SearchBar';
import './MovieSlider3D.css';

const MovieSlider3D = ({ title, movies, language = 'English', searchEnabled = false }) => {
  const [filteredMovies, setFilteredMovies] = useState(movies);
  const [searchQuery, setSearchQuery] = useState('');
  const sliderRef = useRef(null);

  useEffect(() => {
    const uniqueMovies = Array.isArray(movies) ? Array.from(new Map(movies.map(m => [m.id, m])).values()) : [];
    setFilteredMovies(uniqueMovies);
  }, [movies]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      const uniqueMovies = Array.isArray(movies) ? Array.from(new Map(movies.map(m => [m.id, m])).values()) : [];
      setFilteredMovies(uniqueMovies);
      return;
    }
    const filtered = Array.isArray(movies) ? movies.filter(movie =>
      movie.title?.toLowerCase().includes(query.toLowerCase())
    ) : [];
    const uniqueFiltered = Array.from(new Map(filtered.map(m => [m.id, m])).values());
    setFilteredMovies(uniqueFiltered);
  };

  const scroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = 540;
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="movie-slider-3d">
      <div className="slider-header">
        <h2>{title}</h2>
        {searchEnabled && <SearchBar onSearch={handleSearch} />}
      </div>
      {filteredMovies.length === 0 ? (
        <p className="no-results">No movies found for "{searchQuery}"</p>
      ) : (
        <div className="slider-wrapper">
          <button className="slider-btn left" onClick={() => scroll('left')}>‹</button>
          <div className="slider-container" ref={sliderRef}>
            <div className="slider-track">
              {filteredMovies.map((movie) => (
                <MovieCard3D key={movie.id} movie={movie} language={language} />
              ))}
            </div>
          </div>
          <button className="slider-btn right" onClick={() => scroll('right')}>›</button>
        </div>
      )}
    </div>
  );
};

export default MovieSlider3D;
