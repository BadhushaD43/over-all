import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import MovieCard from '../../components/MovieCard/MovieCard';
import { getTrendingByLanguage, searchMovies } from '../../services/api';
import './Search.css';

const Search = () => {
  const location = useLocation();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const query = (new URLSearchParams(location.search).get('q') || '').trim();

  useEffect(() => {
    const loadResults = async () => {
      setLoading(true);
      try {
        if (query) {
          const data = await searchMovies(query, 'English', 1);
          if (data?.length) {
            setMovies(data);
          } else {
            const byLanguage = await getTrendingByLanguage();
            const merged = Object.values(byLanguage || {}).flat();
            const unique = [];
            const seen = new Set();
            merged.forEach((movie) => {
              if (!seen.has(movie.id)) {
                seen.add(movie.id);
                unique.push(movie);
              }
            });
            setMovies(unique);
          }
        } else {
          const byLanguage = await getTrendingByLanguage();
          const merged = Object.values(byLanguage || {}).flat();
          const unique = [];
          const seen = new Set();
          merged.forEach((movie) => {
            if (!seen.has(movie.id)) {
              seen.add(movie.id);
              unique.push(movie);
            }
          });
          setMovies(unique);
        }
      } catch (err) {
        console.error(err);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, [query]);

  return (
    <div className="search-page">
      <Navbar />
      <div className="search-content">
        <h1>{query ? `Search Results for "${query}"` : 'All Movies'}</h1>
        {loading && <p className="search-status">Loading movies...</p>}
        {!loading && movies.length === 0 && <p className="search-status">No movies found.</p>}
        <div className="search-grid">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Search;
