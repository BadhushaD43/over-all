import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminStats from '../../components/AdminStats/AdminStats';
import './AdminDashboard.css';
import { getMyProfile } from '../../services/api';

const AdminDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwords, setPasswords] = useState({ new: '', confirm: '' });
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

  const handlePasswordChange = () => {
    if (passwords.new === passwords.confirm && passwords.new.length >= 6) {
      alert('Password changed successfully');
      setChangingPassword(false);
      setPasswords({ new: '', confirm: '' });
    } else {
      alert('Passwords do not match or too short');
    }
  };

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <h2>Admin Panel</h2>
        <div className="admin-profile">
          <div className="admin-icon">👨‍💼</div>
          <h3>{profile?.name}</h3>
          <p>{profile?.email}</p>
          <p>{profile?.phone}</p>
          
          <button onClick={() => setChangingPassword(!changingPassword)}>
            Change Password
          </button>

          {changingPassword && (
            <div className="password-form">
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
          <button>📊 Dashboard</button>
          <button>👥 Users</button>
          <button>💬 Support</button>
          <button onClick={handleLogout} className="logout-btn">🚪 Logout</button>
        </nav>
      </aside>

      <main className="admin-main">
        <h1>Admin Dashboard</h1>
        <AdminStats />
      </main>
    </div>
  );
};

export default AdminDashboard;
