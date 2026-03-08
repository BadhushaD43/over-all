import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LANGUAGES, signup } from '../../services/api';
import './Signup.css';

const REGIONS = ['USA', 'India', 'UK', 'Canada', 'Australia', 'Germany', 'Japan'];

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirm_password: '',
    region: 'USA',
    language: 'English'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirm_password) {
      setError('Password and confirm password must match.');
      return;
    }

    try {
      setLoading(true);
      const data = await signup(formData);
      localStorage.setItem('token', data.token || data.access_token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-box">
        <h2>Create Your Account</h2>
        <p className="signup-subtitle">Join MovieStream to get personalized recommendations.</p>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="User Name"
            value={formData.name}
            onChange={onChange}
            minLength={2}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={onChange}
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={onChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Create Password"
            value={formData.password}
            onChange={onChange}
            minLength={6}
            required
          />
          <input
            type="password"
            name="confirm_password"
            placeholder="Confirm Password"
            value={formData.confirm_password}
            onChange={onChange}
            minLength={6}
            required
          />

          <div className="signup-row">
            <select name="region" value={formData.region} onChange={onChange} required>
              {REGIONS.map((region) => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
            <select name="language" value={formData.language} onChange={onChange} required>
              {LANGUAGES.map((language) => (
                <option key={language} value={language}>{language}</option>
              ))}
            </select>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Sign Up'}
          </button>
        </form>

        <p className="signin-link">
          Already have an account? <span onClick={() => navigate('/login')}>Login</span>
        </p>
      </div>
    </div>
  );
};

export default Signup;
