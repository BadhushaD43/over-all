import { useEffect, useState } from "react";
import { fetchTrending } from "../services/tmdb";
import MovieCard from "../components/MovieCard";
import "./Trending.css";

const Trending = () => {
  const [movies, setMovies] = useState([]);
  const [timeWindow, setTimeWindow] = useState('week');

  useEffect(() => {
    fetch(`http://localhost:8000/trending?time_window=${timeWindow}`)
      .then(res => res.json())
      .then(data => setMovies(data.results || []));
  }, [timeWindow]);

  return (
    <div className="trending-container">
      <div className="movies-header">
        <h2>Trending Movies</h2>
        <div className="time-selector">
          <button 
            className={timeWindow === 'day' ? 'active' : ''}
            onClick={() => setTimeWindow('day')}
          >
            Today
          </button>
          <button 
            className={timeWindow === 'week' ? 'active' : ''}
            onClick={() => setTimeWindow('week')}
          >
            This Week
          </button>
        </div>
      </div>
      <div className="movie-grid">
        {movies.length > 0 ? (
          movies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))
        ) : (
          <div className="loading">Loading movies...</div>
        )}
      </div>
    </div>
  );
};

export default Trending;
