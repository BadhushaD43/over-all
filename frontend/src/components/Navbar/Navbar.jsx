import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h1 className="logo">🎬 MovieStream</h1>
        <Link to="/">Home</Link>
        <Link to="/trending">Trending</Link>
        <Link to="/upcoming">Upcoming</Link>
      </div>
      <div className="navbar-right">
        <input type="text" placeholder="Search movies..." className="search-box" />
        <Link to="/login"><button className="login-btn">Login</button></Link>
        <Link to="/signup"><button className="signup-btn">Sign Up</button></Link>
      </div>
    </nav>
  );
};

export default Navbar;
