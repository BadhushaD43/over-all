import { useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ onLogout, isOpen = false, onClose = () => {} }) => {
  const navigate = useNavigate();
  const go = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <h2>MovieStream</h2>
      <nav className="sidebar-nav">
        <button onClick={() => go('/dashboard')}>Dashboard</button>
        <button onClick={() => go('/dashboard?view=trending')}>Trending</button>
        <button onClick={() => go('/dashboard?view=upcoming')}>Upcoming</button>
        <button onClick={() => go('/dashboard?view=watchlist')}>Watchlist</button>
        <button onClick={() => go('/profile')}>Settings</button>
        <button onClick={() => { onLogout(); onClose(); }} className="logout-btn">Logout</button>
      </nav>
    </aside>
  );
};

export default Sidebar;
