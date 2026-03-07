import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import UserDashboard from './pages/UserDashboard/UserDashboard';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import ScrollTop from './components/ScrollTop/ScrollTop';
import { getAuthToken } from './services/api';
import './App.css';

function App() {
  const isLoggedIn = Boolean(getAuthToken());

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={isLoggedIn ? <UserDashboard /> : <Navigate to="/login" />} />
          <Route path="/admin" element={isLoggedIn ? <AdminDashboard /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <ScrollTop />
      </div>
    </BrowserRouter>
  );
}

export default App;
