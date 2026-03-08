import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminStats from '../../components/AdminStats/AdminStats';
import './AdminDashboard.css';
import { getMyProfile, updatePassword, getAdminSupportMessages } from '../../services/api';

const AdminDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth > 768);
  const [currentView, setCurrentView] = useState('dashboard');
  const [supportMessages, setSupportMessages] = useState([]);
  const [replyText, setReplyText] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getMyProfile();
        if (!data.is_admin) navigate('/dashboard');
        setProfile(data);
        if (currentView === 'support') loadSupportMessages();
      } catch {
        navigate('/login');
      }
    };
    loadProfile();
  }, [navigate, currentView]);

  const loadSupportMessages = async () => {
    try {
      const data = await getAdminSupportMessages();
      setSupportMessages(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReply = async (messageId) => {
    const response = replyText[messageId]?.trim();
    if (!response) return;
    try {
      await fetch(`${import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000/api'}/admin/support/${messageId}/resolve`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ admin_response: response })
      });
      setReplyText({ ...replyText, [messageId]: '' });
      loadSupportMessages();
    } catch (err) {
      alert('Failed to send reply');
    }
  };

  const handleForwardToDubbing = async (messageId) => {
    try {
      await fetch(`${import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000/api'}/admin/support/${messageId}/forward-dubbing`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      loadSupportMessages();
      alert('Forwarded to dubbing team');
    } catch (err) {
      alert('Failed to forward');
    }
  };

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
          <button onClick={() => setCurrentView('dashboard')} className={currentView === 'dashboard' ? 'active' : ''}>Dashboard</button>
          <button onClick={() => setCurrentView('support')} className={currentView === 'support' ? 'active' : ''}>Support</button>
          <button onClick={() => navigate('/profile')}>Settings</button>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </nav>
      </aside>

      <main className={`admin-main ${sidebarOpen ? 'sidebar-visible' : ''}`}>
        <h1>Admin Dashboard</h1>
        {currentView === 'dashboard' ? (
          <AdminStats />
        ) : (
          <div className="support-messages-section">
            <h2>Support Messages</h2>
            {supportMessages.length === 0 && <p>No support messages</p>}
            {supportMessages.map((msg) => (
              <div key={msg.id} className="support-message-card">
                <div className="support-header">
                  <strong>User ID: {msg.user_id}</strong>
                  <span className={`status-badge ${msg.status}`}>{msg.status.replace('_', ' ')}</span>
                </div>
                <p><strong>Category:</strong> {msg.category}</p>
                {msg.movie_name && <p><strong>Movie:</strong> {msg.movie_name}</p>}
                {msg.preferred_language && <p><strong>Language:</strong> {msg.preferred_language}</p>}
                <p><strong>Message:</strong> {msg.message}</p>
                <p className="message-date">{new Date(msg.created_at).toLocaleString()}</p>
                {msg.admin_response ? (
                  <div className="admin-reply">
                    <strong>Your Reply:</strong> {msg.admin_response}
                  </div>
                ) : msg.status === 'forwarded_to_dubbing' ? (
                  <div className="forwarded-notice">
                    <strong>Status:</strong> Forwarded to dubbing team. Awaiting response.
                    <div className="reply-form" style={{marginTop: '10px'}}>
                      <textarea
                        placeholder="Reply with notice period (e.g., 'Will be available in 2 weeks')..."
                        value={replyText[msg.id] || ''}
                        onChange={(e) => setReplyText({ ...replyText, [msg.id]: e.target.value })}
                      />
                      <button onClick={() => handleReply(msg.id)}>Send Notice Period</button>
                    </div>
                  </div>
                ) : (
                  <div className="reply-form">
                    {msg.category === 'dub_request' || msg.message.toLowerCase().includes('dubbing') || msg.message.toLowerCase().includes('dub') ? (
                      <button className="forward-btn" onClick={() => handleForwardToDubbing(msg.id)}>Forward to Dubbing Team</button>
                    ) : null}
                    <textarea
                      placeholder="Type your reply..."
                      value={replyText[msg.id] || ''}
                      onChange={(e) => setReplyText({ ...replyText, [msg.id]: e.target.value })}
                    />
                    <button onClick={() => handleReply(msg.id)}>Send Reply</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
