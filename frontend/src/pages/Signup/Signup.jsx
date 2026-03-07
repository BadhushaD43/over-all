import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { setAuthToken, signup } from '../../services/api';
import './Signup.css';

const Signup = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirm_password: '',
    language: 'English',
    region: 'USA',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (form.password !== form.confirm_password) {
      setError('Password and confirm password do not match.');
      return;
    }
    try {
      const response = await signup(form);
      setAuthToken(response.token);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Signup failed.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>Sign Up</h1>
        {error && <p className="auth-error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Mobile Number"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={form.confirm_password}
            onChange={(e) => setForm({ ...form, confirm_password: e.target.value })}
            required
          />
          <select value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })}>
            <option>English</option>
            <option>Spanish</option>
            <option>French</option>
            <option>German</option>
            <option>Japanese</option>
            <option>Chinese</option>
            <option>Tamil</option>
          </select>
          <select value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })}>
            <option>India</option>
            <option>USA</option>
            <option>Europe</option>
            <option>Japan</option>
            <option>China</option>
          </select>
          <button type="submit" className="auth-btn">Sign Up</button>
        </form>
        <p>Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
};

export default Signup;
