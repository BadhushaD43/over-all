import { useEffect, useState } from "react";
import { fetchTrending } from "../services/tmdb";
import MovieCard from "../components/MovieCard";
import "./Trending.css";

const Trending = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetchTrending().then(data => setMovies(data.results || []));
  }, []);

  return (
    <div className="trending-container">
      <div className="movies-header">
        <h2>Trending Now</h2>
        <p>Discover the hottest movies and shows</p>
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
