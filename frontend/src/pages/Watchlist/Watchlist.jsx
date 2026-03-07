import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import MovieCard from '../../components/MovieCard/MovieCard';
import './Watchlist.css';

const Watchlist = () => {
  return (
    <div>
      <Navbar />
      <div className="watchlist-page">
        <h1>My Watchlist</h1>
        <div className="watchlist-grid">
          {/* MovieCard components will go here */}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Watchlist;
