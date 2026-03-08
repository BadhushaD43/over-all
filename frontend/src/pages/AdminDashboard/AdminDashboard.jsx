import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminStats from '../../components/AdminStats/AdminStats';
import './AdminDashboard.css';
import { getMyProfile, updatePassword } from '../../services/api';

const AdminDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth > 768);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getMyProfile();
        if (!data.is_admin) navigate('/dashboard');
        setProfile(data);
      } catch {
        navigate('/login');
      }
    };
    loadProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handlePasswordChange = async () => {
    if (passwords.new !== passwords.confirm || passwords.new.length < 6) {
      alert('Passwords do not match or too short');
      return;
    }
    try {
      await updatePassword(passwords.current, passwords.new);
      alert('Password changed successfully');
      setChangingPassword(false);
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (err) {
      alert(err?.message || 'Failed to change password');
    }
  };

  return (
    <div className="admin-dashboard">
      <button className="admin-nav-toggle" onClick={() => setSidebarOpen((prev) => !prev)}>
        <span className="menu-icon" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        Menu
      </button>

      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <h2>Admin Panel</h2>
        <div className="admin-profile">
          <div className="admin-icon">ADMIN</div>
          <h3>{profile?.name}</h3>

          <button onClick={() => setChangingPassword(!changingPassword)}>
            Change Password
          </button>

          {changingPassword && (
            <div className="password-form">
              <input
                type="password"
                placeholder="Current Password"
                value={passwords.current}
                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
              />
              <input
                type="password"
                placeholder="New Password"
                value={passwords.new}
                onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={passwords.confirm}
                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
              />
              <button onClick={handlePasswordChange}>Update</button>
            </div>
          )}
        </div>

        <nav className="admin-nav">
          <button>Dashboard</button>
          <button>Users</button>
          <button>Support</button>
          <button onClick={() => navigate('/profile')}>Settings</button>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </nav>
      </aside>

      <main className={`admin-main ${sidebarOpen ? 'sidebar-visible' : ''}`}>
        <h1>Admin Dashboard</h1>
        <AdminStats />
      </main>
    </div>
  );
};

export default AdminDashboard;
