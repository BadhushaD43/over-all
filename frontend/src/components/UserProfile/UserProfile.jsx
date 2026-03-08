import { useState } from 'react';
import { useDarkMode } from '../../context/DarkModeContext';
import './UserProfile.css';
import { updateProfile } from '../../services/api';

const UserProfile = ({ profile, onUpdate }) => {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState(profile || {});
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwords, setPasswords] = useState({ new: '', confirm: '' });
  const { darkMode, setDarkMode } = useDarkMode();

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
    <div className="user-profile">
      <div className="profile-icon">👤</div>
      
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
          />
          <input
            value={formData.phone || ''}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="Phone"
          />
          <select
            value={formData.language || ''}
            onChange={(e) => setFormData({ ...formData, language: e.target.value })}
          >
            <option>English</option>
            <option>Spanish</option>
            <option>French</option>
            <option>German</option>
            <option>Japanese</option>
          </select>
          <select
            value={formData.region || ''}
            onChange={(e) => setFormData({ ...formData, region: e.target.value })}
          >
            <option>USA</option>
            <option>UK</option>
            <option>India</option>
            <option>Japan</option>
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
          <button onClick={handlePasswordChange}>Update Password</button>
        </div>
      )}

      <div className="dark-mode-toggle">
        <label>
          <input
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
          />
          Dark Mode
        </label>
      </div>
    </div>
  );
};

export default UserProfile;
