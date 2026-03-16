import { useEffect, useState } from 'react';
import { useDarkMode } from '../../context/DarkModeContext';
import { updatePassword, updateProfile } from '../../services/api';
import './UserProfile.css';

const UserProfile = ({ profile, onUpdate = () => {} }) => {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState(profile || {});
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const { darkMode, setDarkMode } = useDarkMode();

  useEffect(() => {
    setFormData(profile || {});
  }, [profile]);

  const handleSave = async () => {
    try {
      await updateProfile(formData);
      onUpdate(formData);
      setEditing(false);
      alert('Profile updated successfully');
    } catch {
      alert('Failed to update profile');
    }
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
    <div className="user-profile">
      <div className="profile-icon">User</div>
      {!editing ? (
        <>
          <h3>{profile?.name}</h3>
          <p>{profile?.email}</p>
          <p>{profile?.phone}</p>
          <p>{profile?.language} | {profile?.region}</p>
          <button onClick={() => setEditing(true)}>Edit Profile</button>
        </>
      ) : (
        <div className="profile-edit">
          <input
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Name"
            className="compact-input"
          />
          <input
            value={formData.phone || ''}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="Phone"
            className="compact-input"
          />
          <select
            value={formData.language || ''}
            onChange={(e) => setFormData({ ...formData, language: e.target.value })}
            className="compact-input"
          >
            <option>English</option>
            <option>Spanish</option>
            <option>French</option>
            <option>German</option>
            <option>Japanese</option>
            <option>Chinese</option>
            <option>Tamil</option>
          </select>
          <select
            value={formData.region || ''}
            onChange={(e) => setFormData({ ...formData, region: e.target.value })}
            className="compact-input"
          >
            <option>USA</option>
            <option>UK</option>
            <option>India</option>
            <option>Japan</option>
            <option>China</option>
          </select>
          <button onClick={handleSave}>Save</button>
          <button onClick={() => setEditing(false)}>Cancel</button>
        </div>
      )}

      <button onClick={() => setChangingPassword(!changingPassword)}>
        Change Password
      </button>

      {changingPassword && (
        <div className="password-change">
          <input
            type="password"
            placeholder="Current Password"
            value={passwords.current}
            onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
            className="compact-input"
          />
          <input
            type="password"
            placeholder="New Password"
            value={passwords.new}
            onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
            className="compact-input"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={passwords.confirm}
            onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
            className="compact-input"
          />
          <button onClick={handlePasswordChange}>Update Password</button>
        </div>
      )}

      <div className="dark-mode-toggle">
        <button 
          onClick={() => setDarkMode(!darkMode)}
          className={`dark-mode-btn ${darkMode ? 'active' : ''}`}
        >
          {darkMode ? '🌙' : '☀️'} {darkMode ? 'Dark Mode' : 'Light Mode'}
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
