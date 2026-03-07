import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MovieSlider3D from '../../components/MovieSlider3D/MovieSlider3D';
import { getTrendingByLanguage, getTrendingMovies, getUpcomingMovies, clearAuthToken, getMyProfile, LANGUAGE_LABELS } from '../../services/api';
import './UserDashboard.css';

const UserDashboard = () => {
  const [movies, setMovies] = useState({});
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [profile, setProfile] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [languageData, trending, upcoming, userProfile] = await Promise.all([
          getTrendingByLanguage(),
          getTrendingMovies('English'),
          getUpcomingMovies('English', 'USA'),
          getMyProfile()
        ]);
        setMovies(languageData || {});
        setTrendingMovies(trending || []);
        setUpcomingMovies(upcoming || []);
        setProfile(userProfile);
      } catch (err) {
        navigate('/login');
      }
    };
    loadData();
  }, [navigate]);

  const handleLogout = () => {
    clearAuthToken();
    navigate('/');
  };

  return (
    <div className="user-dashboard">
      <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
      
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <h2>MovieStream</h2>
        {profile && (
          <div className="profile-section">
            <h3>{profile.name}</h3>
            <p>{profile.email}</p>
            <p>{profile.phone}</p>
            <p>{profile.language} | {profile.region}</p>
          </div>
        )}
        <nav>
          <a onClick={() => navigate('/dashboard')}>Dashboard</a>
          <a onClick={() => setSidebarOpen(false)}>Profile</a>
          <a onClick={() => setSidebarOpen(false)}>Watchlist</a>
          <a onClick={handleLogout}>Logout</a>
        </nav>
      </aside>

      <main className="dashboard-content">
        <header className="dashboard-header">
          <h1>Discover Movies</h1>
          <input 
            type="text" 
            placeholder="Search movies..." 
            className="dashboard-search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </header>

        <MovieSlider3D title="Trending Now" movies={trendingMovies} language="English" />
        <MovieSlider3D title="Upcoming Movies" movies={upcomingMovies} language="English" />
        
        {LANGUAGE_LABELS.map((item) => (
          <MovieSlider3D
            key={item.code}
            title={item.title}
            language={item.code}
            movies={movies[item.code] || []}
          />
        ))}
      </main>
    </div>
  );
};

export default UserDashboard;
