import './Signup.css';

const Signup = () => {
  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>Sign Up</h1>
        <form>
          <input type="text" placeholder="Full Name" />
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <button type="submit" className="auth-btn">Sign Up</button>
        </form>
        <p>Already have an account? <a href="/login">Login</a></p>
      </div>
    </div>
  );
};

export default Signup;
