import { useNavigate } from 'react-router-dom';
import UserProfile from '../UserProfile/UserProfile';
import './Sidebar.css';

const Sidebar = ({ profile, onUpdate, onLogout, isOpen = false, onClose = () => {} }) => {
  const navigate = useNavigate();
  const go = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <h2>MovieStream</h2>
      <UserProfile profile={profile} onUpdate={onUpdate} />
      <nav className="sidebar-nav">
        <button onClick={() => go('/dashboard')}>Dashboard</button>
        <button onClick={() => go('/?view=trending')}>Trending</button>
        <button onClick={() => go('/?view=upcoming')}>Upcoming</button>
        <button onClick={() => go('/dashboard#watchlist')}>Watchlist</button>
        <button onClick={() => go('/dashboard')}>Settings</button>
        <button onClick={() => { onLogout(); onClose(); }} className="logout-btn">Logout</button>
      </nav>
    </aside>
  );
};

export default Sidebar;
