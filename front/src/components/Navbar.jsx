import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import SearchBar from "./SearchBar";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfile, setShowProfile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setShowProfile(false);
    navigate('/');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleSearch = (query) => {
    if (query.trim()) {
      navigate(`/?search=${encodeURIComponent(query)}`);
    } else {
      navigate('/');
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>🎬 MovieApp</h1>
      </div>

      <button className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? '✕' : '☰'}
      </button>
      
      <div className={`navbar-content ${menuOpen ? 'active' : ''}`}>
        <ul className="navbar-links">
          <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
          <li><Link to="/trending" onClick={() => setMenuOpen(false)}>Trending</Link></li>
        </ul>

        <div className="navbar-search">
          <SearchBar onSearch={handleSearch} />
        </div>

        <div className="navbar-right">
          <button 
            className="theme-toggle"
            onClick={toggleDarkMode}
            title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>

          {isAuthenticated ? (
            <div className="profile-menu">
              <button 
                className="profile-btn"
                onClick={() => setShowProfile(!showProfile)}
              >
                {user?.profile_photo ? (
                  <img src={user.profile_photo} alt={user.username} className="profile-img" />
                ) : (
                  '👤'
                )}
                {user?.username}
              </button>
              
              {showProfile && (
                <div className="profile-dropdown">
                  <div className="profile-header">
                    <h3>{user?.username}</h3>
                    <p>{user?.email}</p>
                    <p className="language">Language: {user?.preferred_language?.toUpperCase()}</p>
                  </div>
                  <div className="profile-actions">
                    <button onClick={() => { navigate('/profile'); setShowProfile(false); }} className="profile-link-btn">
                      Profile & Settings
                    </button>
                    <button onClick={handleLogout} className="logout-btn">
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button 
              className="login-btn"
              onClick={handleLoginClick}
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

