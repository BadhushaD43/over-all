import { useEffect, useState } from "react";
import { fetchTrending } from "../services/tmdb";
import MovieCard from "../components/MovieCard";
import "./Home.css";

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "en-US"
  );

  useEffect(() => {
    fetchTrending().then(data => setMovies(data.results));
  }, []);
  
  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  return (
    <div className="home-container">
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

export default Home;
