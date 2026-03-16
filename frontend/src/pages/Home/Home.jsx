import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import HeroSection from '../../components/HeroSection/HeroSection';
import MovieSlider from '../../components/MovieSlider/MovieSlider';
import MovieDetailModal from '../../components/MovieDetailModal/MovieDetailModal';
import Footer from '../../components/Footer/Footer';
import './Home.css';
import { getTodayMovieCollection, getTrendingByLanguage, getTrendingMovies, getUpcomingMovies, LANGUAGES } from '../../services/api';

const Home = () => {
  const location = useLocation();
  const [movies, setMovies] = useState({});
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [todayCollectionMovies, setTodayCollectionMovies] = useState([]);
  const [todayDate, setTodayDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);
  
  const currentView = (() => {
    if (location.pathname === '/upcoming') return 'upcoming';
    if (location.pathname === '/trending') return 'trending';
    const view = new URLSearchParams(location.search).get('view');
    return view === 'upcoming' ? 'upcoming' : 'trending';
  })();

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
  };

  const closeModal = () => {
    setSelectedMovie(null);
  };

  useEffect(() => {
    const loadMovies = async () => {
      try {
        setError('');
        const tasks = [
          getTrendingByLanguage()
            .then((byLanguage) => setMovies(byLanguage || {}))
            .catch(() => setMovies({})),
          getTrendingMovies('English')
            .then((trending) => setTrendingMovies(trending || []))
            .catch(() => setTrendingMovies([])),
          getUpcomingMovies('English', 'USA')
            .then((upcoming) => setUpcomingMovies(upcoming || []))
            .catch(() => setUpcomingMovies([])),
          getTodayMovieCollection('English', 'USA')
            .then((todayCollection) => {
              setTodayCollectionMovies(todayCollection?.results || []);
              setTodayDate(todayCollection?.today_date || '');
            })
            .catch(() => {
              setTodayCollectionMovies([]);
              setTodayDate('');
            })
        ];
        await Promise.allSettled(tasks);
      } catch (err) {
        console.error('Error loading movies:', err);
        setError('Failed to load movies. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    loadMovies();
  }, []);

  return (
    <div className="home">
      <Navbar />
      <HeroSection />
      {loading && <p className="loading">Loading movies...</p>}
      {error && <p className="loading">{error}</p>}
      <>
        <MovieSlider title={`Today Collection (${todayDate || 'Live'})`} movies={todayCollectionMovies} onMovieClick={handleMovieClick} />
        {currentView === 'trending' ? (
          <MovieSlider title="Trending Movies" movies={trendingMovies} onMovieClick={handleMovieClick} />
        ) : (
          <MovieSlider title="Upcoming Movies" movies={upcomingMovies} onMovieClick={handleMovieClick} />
        )}

        <h2 className="home-section-title">Trending By Language</h2>
        {LANGUAGES.map((lang) => (
          <MovieSlider
            key={lang}
            title={`${lang} Movies`}
            movies={movies[lang] || []}
            onMovieClick={handleMovieClick}
          />
        ))}
      </>
      {selectedMovie && <MovieDetailModal movie={selectedMovie} onClose={closeModal} />}
      <Footer />
    </div>
  );
};

export default Home;