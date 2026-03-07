import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getWatchlist, removeWatchlist, clearAuthToken } from '../../services/api';
import './Watchlist.css';

const Watchlist = () => {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const loadWatchlist = async () => {
    try {
      const data = await getWatchlist();
      setMovies(data || []);
    } catch (err) {
      setError('Please login to view watchlist.');
      navigate('/login');
    }
  };

  useEffect(() => {
    loadWatchlist();
  }, []);

  const handleRemove = async (itemId) => {
    try {
      await removeWatchlist(itemId);
      loadWatchlist();
    } catch (err) {
      setError(err.message || 'Failed to remove movie.');
    }
  };

  const handleLogout = () => {
    clearAuthToken();
    navigate('/');
  };

  return (
    <div className="user-dashboard">
      <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
      
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <h2>MovieStream</h2>
        <nav>
          <a onClick={() => navigate('/dashboard')}>Trending</a>
          <a onClick={() => navigate('/dashboard')}>Upcoming</a>
          <a onClick={() => navigate('/profile')}>Profile</a>
          <a onClick={() => navigate('/watchlist')}>Watchlist</a>
          <a onClick={handleLogout}>Logout</a>
        </nav>
      </aside>

      <main className="dashboard-content">
        <h1>My Watchlist</h1>
        {error && <p style={{color: '#ff6b6b'}}>{error}</p>}
        <div className="watchlist-grid">
          {movies.map((movie) => {
            const posterPath = movie?.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : 'https://placehold.co/300x450?text=No+Poster';
            return (
              <div className="movie-card" key={movie.id}>
                <img src={posterPath} alt={movie.movie_title} />
                <div className="movie-info">
                  <h3>{movie.movie_title}</h3>
                  <p>{movie.release_date || 'TBA'}</p>
                  <button className="watchlist-small-btn" onClick={() => handleRemove(movie.id)}>
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Watchlist;

