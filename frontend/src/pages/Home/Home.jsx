import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import HeroSection from '../../components/HeroSection/HeroSection';
import MovieSlider from '../../components/MovieSlider/MovieSlider';
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
  const currentView = (() => {
    if (location.pathname === '/upcoming') return 'upcoming';
    if (location.pathname === '/trending') return 'trending';
    const view = new URLSearchParams(location.search).get('view');
    return view === 'upcoming' ? 'upcoming' : 'trending';
  })();

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const [byLanguage, trending, upcoming, todayCollection] = await Promise.all([
          getTrendingByLanguage(),
          getTrendingMovies('English'),
          getUpcomingMovies('English', 'USA'),
          getTodayMovieCollection('English', 'USA')
        ]);
        setMovies(byLanguage || {});
        setTrendingMovies(trending || []);
        setUpcomingMovies(upcoming || []);
        setTodayCollectionMovies(todayCollection?.results || []);
        setTodayDate(todayCollection?.today_date || '');
      } catch (err) {
        console.error(err);
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
      {loading ? (
        <p className="loading">Loading movies...</p>
      ) : (
        <>
          <MovieSlider title={`Today Collection (${todayDate || 'Live'})`} movies={todayCollectionMovies} />
          {currentView === 'trending' ? (
            <MovieSlider title="Trending Movies" movies={trendingMovies} />
          ) : (
            <MovieSlider title="Upcoming Movies" movies={upcomingMovies} />
          )}

          <h2 className="home-section-title">Trending By Language</h2>
          {LANGUAGES.map((lang) => (
            <MovieSlider
              key={lang}
              title={`${lang} Movies`}
              movies={movies[lang] || []}
            />
          ))}
        </>
      )}
      <Footer />
    </div>
  );
};

export default Home;
