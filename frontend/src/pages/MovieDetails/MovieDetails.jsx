import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { addWatchlist, getMovieDetails } from '../../services/api';
import './MovieDetails.css';

const MovieDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState('');
  const language = new URLSearchParams(location.search).get('lang') || 'English';

  useEffect(() => {
    const loadMovie = async () => {
      try {
        const data = await getMovieDetails(id, language);
        setMovie(data);
      } catch (err) {
        setError(err.message || 'Unable to load movie details.');
      }
    };

    loadMovie();
  }, [id, language]);

  const handleAddWatchlist = async () => {
    try {
      await addWatchlist(movie);
      setError('Added to watchlist.');
    } catch (err) {
      setError(err.message || 'Please login to add watchlist.');
      navigate('/login');
    }
  };

  const posterPath = movie?.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://placehold.co/300x450?text=No+Poster';

  return (
    <div>
      <Navbar />
      <div className="movie-details">
        {error && <p className="home-message">{error}</p>}
        {!movie && !error && <p className="home-message">Loading...</p>}
        {movie && (
          <>
            <div className="movie-poster">
              <img src={posterPath} alt={movie.title} />
            </div>
            <div className="movie-info-detail">
              <h1>{movie.title}</h1>
              <p className="rating">Rating: {movie.rating || 'N/A'}/10</p>
              <p className="overview">{movie.overview || 'No overview available.'}</p>
              <div className="action-buttons">
                <button className="watch-btn">Watch Now</button>
                <button className="watchlist-btn" onClick={handleAddWatchlist}>Add to Watchlist</button>
              </div>
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default MovieDetails;

