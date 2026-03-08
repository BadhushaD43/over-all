import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { login } from '../../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(email, password);
      localStorage.setItem('token', data.token || data.access_token);

      if (data.is_admin) {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h2>Login to MovieStream</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
        <p className="signup-link">
          New user? <span onClick={() => navigate('/signup')}>Create an account</span>
        </p>
        <p className="back-link" onClick={() => navigate('/')}>Back to Home</p>
      </div>
    </div>
  );
};

export default Login;
