import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [username, setUsername] = useState(user?.username || '');
  const [profilePhoto, setProfilePhoto] = useState(user?.profile_photo || '');
  const [language, setLanguage] = useState(user?.preferred_language || 'en');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setProfilePhoto(user.profile_photo || '');
      setLanguage(user.preferred_language || 'en');
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await updateProfile({ username, profile_photo: profilePhoto, preferred_language: language });
      setMessage('Profile updated successfully!');
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const response = await fetch('http://localhost:8000/auth/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ current_password: currentPassword, new_password: newPassword })
      });
      if (response.ok) {
        setMessage('Password changed successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        const data = await response.json();
        setError(data.detail || 'Failed to change password');
      }
    } catch (err) {
      setError('Failed to change password');
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {profilePhoto ? (
              <img src={profilePhoto} alt={username} />
            ) : (
              <div className="avatar-placeholder">👤</div>
            )}
          </div>
          <h2>{user?.username}</h2>
          <p>{user?.email}</p>
        </div>

        <div className="profile-tabs">
          <button 
            className={activeTab === 'profile' ? 'active' : ''} 
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
          <button 
            className={activeTab === 'settings' ? 'active' : ''} 
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
        </div>

        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}

        {activeTab === 'profile' && (
          <form onSubmit={handleProfileUpdate} className="profile-form">
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Profile Photo URL</label>
              <input
                type="url"
                value={profilePhoto}
                onChange={(e) => setProfilePhoto(e.target.value)}
                placeholder="https://example.com/photo.jpg"
              />
            </div>
            <div className="form-group">
              <label>Preferred Language</label>
              <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="ta">Tamil</option>
                <option value="te">Telugu</option>
                <option value="ml">Malayalam</option>
                <option value="fr">French</option>
                <option value="es">Spanish</option>
              </select>
            </div>
            <button type="submit" className="btn-primary">Update Profile</button>
          </form>
        )}

        {activeTab === 'settings' && (
          <form onSubmit={handlePasswordChange} className="profile-form">
            <h3>Change Password</h3>
            <div className="form-group">
              <label>Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-primary">Change Password</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
