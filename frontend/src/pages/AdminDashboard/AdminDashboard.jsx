import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthToken, clearAuthToken } from '../../services/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!getAuthToken()) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    clearAuthToken();
    navigate('/');
  };

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <h2>Admin Panel</h2>
        <nav>
          <a onClick={() => navigate('/admin')}>Dashboard</a>
          <a onClick={() => navigate('/admin')}>Users</a>
          <a onClick={() => navigate('/admin')}>Movies</a>
          <a onClick={() => navigate('/admin')}>Support</a>
          <a onClick={handleLogout}>Logout</a>
        </nav>
      </aside>
      <main className="admin-content">
        <h1>Admin Dashboard</h1>
        <p>Admin features coming soon...</p>
      </main>
    </div>
  );
};

export default AdminDashboard;
