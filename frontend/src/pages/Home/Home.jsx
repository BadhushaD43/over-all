import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import MovieSlider from '../../components/MovieSlider/MovieSlider';
import Footer from '../../components/Footer/Footer';
import { addWatchlist, getTrendingByLanguage, LANGUAGE_LABELS } from '../../services/api';
import './Home.css';

const Home = () => {
  const [movies, setMovies] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadMovies = async () => {
      try {
        setLoading(true);
        const data = await getTrendingByLanguage();
        setMovies(data || {});
      } catch (err) {
        setError(err.message || 'Unable to load movies right now.');
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, []);

  const handleAddWatchlist = async (movie) => {
    try {
      await addWatchlist(movie);
      setError('Added to watchlist.');
    } catch (err) {
      setError(err.message || 'Please login to add watchlist.');
      if ((err.message || '').toLowerCase().includes('unauthorized')) {
        navigate('/login');
      }
    }
  };

  return (
    <div className="home">
      <Navbar />
      <div className="hero-banner">
        <h1>Unlimited movies, TV shows, and more</h1>
        <p>Watch anywhere. Cancel anytime.</p>
      </div>
      {loading && <p className="home-message">Loading movies...</p>}
      {error && <p className="home-message">{error}</p>}
      {LANGUAGE_LABELS.map((item) => (
        <MovieSlider
          key={item.code}
          title={item.title}
          language={item.code}
          movies={movies[item.code] || []}
          onAddWatchlist={handleAddWatchlist}
        />
      ))}
      <Footer />
    </div>
  );
};

export default Home;
