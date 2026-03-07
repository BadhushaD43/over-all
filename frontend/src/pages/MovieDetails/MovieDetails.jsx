import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import './MovieDetails.css';

const MovieDetails = () => {
  return (
    <div>
      <Navbar />
      <div className="movie-details">
        <div className="movie-poster">
          <img src="https://via.placeholder.com/300x450" alt="Movie" />
        </div>
        <div className="movie-info-detail">
          <h1>Movie Title</h1>
          <p className="rating">⭐ 8.5/10</p>
          <p className="overview">Movie overview goes here...</p>
          <div className="action-buttons">
            <button className="watch-btn">▶ Watch Now</button>
            <button className="watchlist-btn">+ Add to Watchlist</button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MovieDetails;
