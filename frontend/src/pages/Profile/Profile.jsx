import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import UserProfile from '../../components/UserProfile/UserProfile';
import './Profile.css';
import { getMyProfile } from '../../services/api';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth > 768);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getMyProfile();
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

  return (
    <div className="profile-page">
      <button className="profile-nav-toggle" onClick={() => setSidebarOpen((prev) => !prev)}>
        <span className="menu-icon" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        Menu
      </button>

      <Sidebar
        profile={profile}
        onUpdate={setProfile}
        onLogout={handleLogout}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className={`profile-main ${sidebarOpen ? 'sidebar-visible' : ''}`}>
        <h1>My Profile</h1>
        <UserProfile profile={profile} onUpdate={setProfile} />
      </main>
    </div>
  );
};

export default Profile;
