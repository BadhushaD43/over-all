import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import MovieSlider from '../../components/MovieSlider/MovieSlider';
import Footer from '../../components/Footer/Footer';
import './UserDashboard.css';
import { getTodayMovieCollection, getTrendingByLanguage, getMyProfile, getWatchlist, LANGUAGES } from '../../services/api';

const UserDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [movies, setMovies] = useState({});
  const [todayCollectionMovies, setTodayCollectionMovies] = useState([]);
  const [todayDate, setTodayDate] = useState('');
  const [watchlist, setWatchlist] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [profileData, moviesData, watchlistData, todayCollection] = await Promise.all([
          getMyProfile(),
          getTrendingByLanguage(),
          getWatchlist(),
          getTodayMovieCollection('English', profile?.region || 'USA')
        ]);
        setProfile(profileData);
        setMovies(moviesData || {});
        setTodayCollectionMovies(todayCollection?.results || []);
        setTodayDate(todayCollection?.today_date || '');
        setWatchlist(watchlistData);
      } catch {
        navigate('/login');
      }
    };
    loadData();
  }, [navigate, profile?.region]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const preferredLang = profile?.language || 'English';
  const otherLangs = LANGUAGES.filter(lang => lang !== preferredLang).slice(0, 5);

  return (
    <div className="user-dashboard">
      <button className="user-nav-toggle" onClick={() => setSidebarOpen((prev) => !prev)}>
        Menu
      </button>
      <Sidebar
        profile={profile}
        onUpdate={setProfile}
        onLogout={handleLogout}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <main className="dashboard-main">
        <div className="dashboard-topbar">
          <h1>Welcome, {profile?.name}!</h1>
          <div className="dashboard-profile-nav">
            <h3>{profile?.name}</h3>
            <p>{profile?.email}</p>
            <p>{profile?.phone}</p>
            <p>{profile?.language} | {profile?.region}</p>
          </div>
        </div>
        
        <section id="watchlist" className="watchlist-section">
          <h2>My Watchlist</h2>
          <div className="watchlist-grid">
            {watchlist.length === 0 && <p className="empty-watchlist">No movies in watchlist yet. Click any movie card to add.</p>}
            {watchlist.map((item) => {
              const poster = item.poster_path
                ? `https://image.tmdb.org/t/p/w200${item.poster_path}`
                : 'https://placehold.co/200x300?text=No+Poster';
              return (
                <div key={item.id} className="watchlist-item">
                  <img src={poster} alt={item.title} />
                  <p>{item.title}</p>
                </div>
              );
            })}
          </div>
        </section>

        <MovieSlider title={`Today Collection (${todayDate || 'Live'})`} movies={todayCollectionMovies} />
        <MovieSlider title={`${preferredLang} Movies`} movies={movies[preferredLang] || []} />
        
        {otherLangs.map((lang) => (
          <MovieSlider key={lang} title={`${lang} Movies`} movies={movies[lang] || []} />
        ))}
        
        <Footer />
      </main>
    </div>
  );
};

export default UserDashboard;
