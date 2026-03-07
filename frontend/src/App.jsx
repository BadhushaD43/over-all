import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import MovieDetails from './pages/MovieDetails/MovieDetails';
import Watchlist from './pages/Watchlist/Watchlist';
import ScrollTop from './components/ScrollTop/ScrollTop';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/watchlist" element={<Watchlist />} />
        </Routes>
        <ScrollTop />
      </div>
    </BrowserRouter>
  );
}

export default App;
