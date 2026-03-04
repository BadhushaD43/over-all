import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchTrending, searchMovies } from "../services/tmdb";
import MovieCard from "../components/MovieCard";
import "./Home.css";

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search');

  useEffect(() => {
    if (searchQuery) {
      searchMovies(searchQuery).then(data => setMovies(data.results || []));
    } else {
      fetchTrending().then(data => setMovies(data.results || []));
    }
  }, [searchQuery]);

  return (
    <div className="home-container">
      <div className="movies-header">
        <h2>{searchQuery ? `Search Results for "${searchQuery}"` : 'Trending Now'}</h2>
        <p>{searchQuery ? `Found ${movies.length} movies` : 'Discover the hottest movies and shows'}</p>
      </div>
      <div className="movie-grid">
        {movies.length > 0 ? (
          movies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))
        ) : (
          <div className="loading">{searchQuery ? 'No movies found' : 'Loading movies...'}</div>
        )}
      </div>
    </div>
  );
};

export default Home;
