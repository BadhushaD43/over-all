import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/search?q=${searchQuery}`);
  };

  const setView = (view) => {
    navigate(`/?view=${view}`);
  };

  const activeView = (() => {
    if (location.pathname === '/upcoming') return 'upcoming';
    if (location.pathname === '/trending') return 'trending';
    return new URLSearchParams(location.search).get('view') || 'trending';
  })();

  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={() => navigate('/')}>MovieStream</div>
      <form className="navbar-search" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search movies..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </form>
      <div className="navbar-links">
        <button onClick={() => setView('trending')} className={activeView === 'trending' ? 'active' : ''}>Trending</button>
        <button onClick={() => setView('upcoming')} className={activeView === 'upcoming' ? 'active' : ''}>Upcoming</button>
        <button onClick={() => navigate('/login')} className="login-btn">Login</button>
      </div>
    </nav>
  );
};

export default Navbar;
