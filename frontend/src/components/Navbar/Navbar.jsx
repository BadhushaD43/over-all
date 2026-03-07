import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { clearAuthToken, getAuthToken } from '../../services/api';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = Boolean(getAuthToken());
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    clearAuthToken();
    setDrawerOpen(false);
    navigate('/');
  };

  const closeDrawer = () => setDrawerOpen(false);

  return (
    <>
      <nav className="navbar">
        {isLoggedIn && (
          <button className="menu-btn" onClick={() => setDrawerOpen(true)} aria-label="Open menu">
            <span />
            <span />
            <span />
          </button>
        )}

        <div className="navbar-left">
          <h1 className="logo">MovieStream</h1>
          <Link to="/">Home</Link>
        </div>

        <div className="navbar-right">
          <input type="text" placeholder="Search movies..." className="search-box" />
          {!isLoggedIn && (
            <>
              <Link to="/login"><button className="login-btn">Login</button></Link>
              <Link to="/signup"><button className="signup-btn">Sign Up</button></Link>
            </>
          )}
          {isLoggedIn && <button className="signup-btn" onClick={handleLogout}>Logout</button>}
        </div>
      </nav>

      <div className={`drawer-overlay ${drawerOpen ? 'open' : ''}`} onClick={closeDrawer} />
      <aside className={`left-drawer ${drawerOpen ? 'open' : ''}`}>
        <button className="drawer-close" onClick={closeDrawer} aria-label="Close menu">x</button>
        <Link to="/" onClick={closeDrawer}>Home</Link>
        {!isLoggedIn && <Link to="/login" onClick={closeDrawer}>Login</Link>}
        {!isLoggedIn && <Link to="/signup" onClick={closeDrawer}>Sign Up</Link>}
        {isLoggedIn && <button className="drawer-logout" onClick={handleLogout}>Logout</button>}
      </aside>
    </>
  );
};

export default Navbar;

