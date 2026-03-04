import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./MovieDetail.css";

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user, updateLanguage } = useAuth();
  const [movie, setMovie] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [showVideo, setShowVideo] = useState(false);
  const [videoKey, setVideoKey] = useState(null);
  const API_KEY = "8265bd1679663a7ea12ac168da84d2e8";

  useEffect(() => {
    // Set initial language from user preference
    if (isAuthenticated && user?.preferred_language) {
      setSelectedLanguage(user.preferred_language);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=${selectedLanguage}`)
      .then(res => res.json())
      .then(data => setMovie(data));
  }, [id, selectedLanguage]);

  const handleLanguageChange = async (language) => {
    setSelectedLanguage(language);
    if (isAuthenticated) {
      try {
        await updateLanguage(language);
      } catch (error) {
        console.error('Failed to update language preference:', error);
      }
    }
  };

  const handlePlayVideo = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      const response = await fetch(`http://localhost:8000/movie/${id}/videos?language=${selectedLanguage}`);
      const data = await response.json();
      const trailer = data.results?.find(v => v.type === "Trailer" && v.site === "YouTube") || data.results?.[0];
      if (trailer) {
        setVideoKey(trailer.key);
        setShowVideo(true);
      }
    } catch (error) {
      console.error('Failed to fetch video:', error);
    }
  };

  if (!movie) return <div className="loading">Loading...</div>;

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ja', name: 'Japanese' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ta', name: 'Tamil' },
  ];

  return (
    <div className="movie-detail">
      <div className="backdrop" style={{backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`}} />
      <div className="content">
        <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
        <div className="info">
          <h1>{movie.title}</h1>
          <p className="tagline">{movie.tagline}</p>
          <div className="meta">
            <span>⭐ {movie.vote_average?.toFixed(1) || 0}/10</span>
            <span>📅 {movie.release_date}</span>
            <span>⏱️ {movie.runtime} min</span>
          </div>
          <p className="overview">{movie.overview}</p>
          <div className="genres">
            {movie.genres?.map(g => <span key={g.id} className="genre">{g.name}</span>)}
          </div>

          <div className="language-section">
            <h3>Select Language</h3>
            <div className="language-selector">
              {languages.map(lang => (
                <button
                  key={lang.code}
                  className={`lang-btn ${selectedLanguage === lang.code ? 'active' : ''}`}
                  onClick={() => handleLanguageChange(lang.code)}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </div>

          <div className="action-buttons">
            <button className="play-btn" onClick={handlePlayVideo}>
              ▶️ Watch Now
            </button>
            <button className="watchlist-btn">
              + Add to Watchlist
            </button>
          </div>

          {showVideo && videoKey && (
            <div className="video-modal">
              <div className="video-container">
                <button className="close-video" onClick={() => setShowVideo(false)}>✕</button>
                <p className="video-source">Video Source: <strong>https://www.youtube.com/embed/{videoKey}</strong></p>
                <iframe
                  width="100%"
                  height="600"
                  src={`https://www.youtube.com/embed/${videoKey}?autoplay=1`}
                  title={movie.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
                <p className="video-language">Playing in: <strong>{languages.find(l => l.code === selectedLanguage)?.name}</strong></p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;

