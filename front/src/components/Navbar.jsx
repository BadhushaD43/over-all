import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);

  const handleLogout = () => {
    logout();
    setShowProfile(false);
    navigate('/');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>🎬 MovieApp</h1>
      </div>
      
      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/trending">Trending</Link></li>
        <li><Link to="/search">Search</Link></li>
      </ul>

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
              👤 {user?.username}
            </button>
            
            {showProfile && (
              <div className="profile-dropdown">
                <div className="profile-header">
                  <h3>{user?.username}</h3>
                  <p>{user?.email}</p>
                  <p className="language">Language: {user?.preferred_language?.toUpperCase()}</p>
                </div>
                <div className="profile-actions">
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
    </nav>
  );
};

export default Navbar;

