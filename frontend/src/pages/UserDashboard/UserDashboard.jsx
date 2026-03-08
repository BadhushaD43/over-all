import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import MovieSlider from '../../components/MovieSlider/MovieSlider';
import ChatSupport from '../../components/ChatSupport/ChatSupport';
import Footer from '../../components/Footer/Footer';
import './UserDashboard.css';
import {
  addWatchlist,
  getMovieDetails,
  getMovieVideos,
  getMyProfile,
  getTrendingByLanguage,
  getTrendingMovies,
  getUpcomingMovies,
  getWatchlist,
  searchMovies,
  sendSupportMessage
} from '../../services/api';

const GENRE_MAP = [
  { key: 'drama', title: 'Drama Movies', id: 18 },
  { key: 'action', title: 'Action Movies', id: 28 },
  { key: 'comedy', title: 'Comedy Movies', id: 35 },
  { key: 'thriller', title: 'Thriller Movies', id: 53 },
  { key: 'romantic', title: 'Romantic Movies', id: 10749 },
  { key: 'horror', title: 'Horror Movies', id: 27 }
];

const UserDashboard = () => {
  const location = useLocation();
  const [profile, setProfile] = useState(null);
  const [preferredTrendingMovies, setPreferredTrendingMovies] = useState([]);
  const [preferredUpcomingMovies, setPreferredUpcomingMovies] = useState([]);
  const [genreMovies, setGenreMovies] = useState({});
  const [watchlist, setWatchlist] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth > 768);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedMovieDetails, setSelectedMovieDetails] = useState(null);
  const [trailerKey, setTrailerKey] = useState('');
  const [showPlayer, setShowPlayer] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const navigate = useNavigate();
  const currentView = new URLSearchParams(location.search).get('view') || 'dashboard';

  useEffect(() => {
    const loadData = async () => {
      try {
        const [profileData, watchlistData] = await Promise.all([
          getMyProfile(),
          getWatchlist()
        ]);
        setProfile(profileData);
        setWatchlist(watchlistData);

        const language = (profileData?.language || 'English').trim();
        const region = (profileData?.region || 'USA').trim();
        const [trending1, trending2, trending3, upcoming1, upcoming2, upcoming3, byLanguage] = await Promise.all([
          getTrendingMovies(language, 1),
          getTrendingMovies(language, 2),
          getTrendingMovies(language, 3),
          getUpcomingMovies(language, region, 1),
          getUpcomingMovies(language, region, 2),
          getUpcomingMovies(language, region, 3),
          getTrendingByLanguage()
        ]);

        const fallbackPreferredTrending = [...(trending1 || []), ...(trending2 || []), ...(trending3 || [])];
        const fallbackPreferredUpcoming = [...(upcoming1 || []), ...(upcoming2 || []), ...(upcoming3 || [])];
        const preferredKey = Object.keys(byLanguage || {}).find((key) => key.trim().toLowerCase() === language.toLowerCase());
        const preferredFromLanguageMap = preferredKey ? byLanguage?.[preferredKey] : [];
        const trendingMovies = preferredFromLanguageMap.length > 0 ? preferredFromLanguageMap : fallbackPreferredTrending;
        setPreferredTrendingMovies(trendingMovies);
        setPreferredUpcomingMovies(fallbackPreferredUpcoming);

        const byGenre = {};
        GENRE_MAP.forEach((genre) => {
          byGenre[genre.key] = trendingMovies.filter((movie) => (movie.genre_ids || []).includes(genre.id));
        });
        setGenreMovies(byGenre);
      } catch {
        navigate('/login');
      }
    };

    loadData();
  }, [navigate, currentView]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const preferredLang = profile?.language || 'English';
  const isSearchMode = searchQuery.trim().length > 0;
  const isWatchlistView = currentView === 'watchlist';
  const isSupportView = currentView === 'support';
  const isUpcomingView = currentView === 'upcoming';
  const isTrendingView = currentView === 'trending';
  const currentPreferredMovies = isUpcomingView ? preferredUpcomingMovies : preferredTrendingMovies;

  const handleSearch = async (event) => {
    event.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    try {
      setSearchLoading(true);
      setHasSearched(true);
      const query = searchQuery.trim().toLowerCase();
      const results = await searchMovies(searchQuery.trim(), preferredLang, 1);
      const sortedResults = [...(results || [])].sort((a, b) => {
        const aTitle = (a?.title || '').toLowerCase();
        const bTitle = (b?.title || '').toLowerCase();
        const aStarts = aTitle.startsWith(query) ? 1 : 0;
        const bStarts = bTitle.startsWith(query) ? 1 : 0;
        if (aStarts !== bStarts) return bStarts - aStarts;
        const aIncludes = aTitle.includes(query) ? 1 : 0;
        const bIncludes = bTitle.includes(query) ? 1 : 0;
        if (aIncludes !== bIncludes) return bIncludes - aIncludes;
        return aTitle.localeCompare(bTitle);
      });
      setSearchResults(sortedResults);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleMovieOpen = async (movie) => {
    if (!movie?.id) return;
    setSelectedMovie(movie);
    setSelectedMovieDetails(null);
    setTrailerKey('');
    setShowPlayer(false);
    setDetailsLoading(true);
    try {
      const [liveDetails, videos] = await Promise.all([
        getMovieDetails(movie.id, preferredLang),
        getMovieVideos(movie.id, preferredLang)
      ]);
      setSelectedMovieDetails(liveDetails);
      const youtubeVideos = (videos || []).filter((video) => video.site === 'YouTube');
      const pickedTrailer = youtubeVideos.find((video) => video.type === 'Trailer')
        || youtubeVideos.find((video) => video.type === 'Teaser')
        || youtubeVideos[0];
      setTrailerKey(pickedTrailer?.key || '');
    } catch {
      setSelectedMovieDetails(null);
      setTrailerKey('');
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleAddWatchlist = async () => {
    if (!selectedMovie || actionLoading) return;
    try {
      setActionLoading(true);
      await addWatchlist(selectedMovie);
      const updatedWatchlist = await getWatchlist();
      setWatchlist(updatedWatchlist);
      alert('Added to watchlist');
    } catch {
      alert('Failed to add watchlist');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRequestDubbing = async () => {
    if (!selectedMovieDetails || actionLoading) return;
    try {
      setActionLoading(true);
      await sendSupportMessage(
        `Dubbing request: "${selectedMovieDetails.title}" in ${preferredLang} language.`,
        'dub_request',
        selectedMovieDetails.title,
        preferredLang
      );
      alert('Dubbing request sent successfully');
    } catch {
      alert('Failed to send dubbing request');
    } finally {
      setActionLoading(false);
    }
  };

  const closeMovieModal = () => {
    setSelectedMovie(null);
    setSelectedMovieDetails(null);
    setTrailerKey('');
    setShowPlayer(false);
  };

  const details = selectedMovieDetails || selectedMovie;
  const poster = details?.poster_path
    ? `https://image.tmdb.org/t/p/w300${details.poster_path}`
    : 'https://placehold.co/300x450?text=No+Poster';
  const detailsLanguage = details?.original_language?.toUpperCase() || 'N/A';

  return (
    <div className="user-dashboard">
      <button className="user-nav-toggle" onClick={() => setSidebarOpen((prev) => !prev)}>
        <span className="menu-icon" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        Menu
      </button>
      <Sidebar
        onLogout={handleLogout}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <main className={`dashboard-main ${sidebarOpen ? 'sidebar-visible' : ''}`}>
        <div className="dashboard-topbar">
          <h1>Welcome, {profile?.name}!</h1>
          <form className="dashboard-search" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder={`Search ${preferredLang} movies...`}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (!e.target.value.trim()) {
                  setHasSearched(false);
                  setSearchResults([]);
                }
              }}
            />
            <button type="submit" disabled={searchLoading}>
              {searchLoading ? 'Searching...' : 'Search'}
            </button>
          </form>
        </div>

        {isWatchlistView ? (
          <section className="watchlist-section">
            <h2>My Watchlist</h2>
            <div className="watchlist-grid">
              {watchlist.length === 0 && <p className="empty-watchlist">No movies in watchlist yet.</p>}
              {watchlist.map((item) => {
                const watchlistPoster = item.poster_path
                  ? `https://image.tmdb.org/t/p/w200${item.poster_path}`
                  : 'https://placehold.co/200x300?text=No+Poster';
                return (
                  <div key={item.id} className="watchlist-item">
                    <img src={watchlistPoster} alt={item.title} />
                    <p>{item.title}</p>
                  </div>
                );
              })}
            </div>
          </section>
        ) : isSupportView ? (
          <ChatSupport />
        ) : isSearchMode ? (
          <>
            {hasSearched && searchResults.length === 0 && <p className="empty-watchlist">No movies found for this search.</p>}
            <MovieSlider
              title={`Search Results (${preferredLang})`}
              movies={searchResults}
              onMovieClick={handleMovieOpen}
            />
          </>
        ) : isTrendingView || isUpcomingView ? (
          <>
            <h2 className="dashboard-section-title">Preferred Language: {preferredLang}</h2>
            <MovieSlider
              title={`${preferredLang} ${isUpcomingView ? 'Upcoming' : 'Trending'} Movies`}
              movies={currentPreferredMovies}
              onMovieClick={handleMovieOpen}
            />
          </>
        ) : (
          <>
            <h2 className="dashboard-section-title">Preferred Language: {preferredLang}</h2>
            <MovieSlider
              title={`${preferredLang} Movies`}
              movies={preferredTrendingMovies}
              onMovieClick={handleMovieOpen}
            />
            {GENRE_MAP.map((genre) => (
              <MovieSlider
                key={genre.key}
                title={`${preferredLang} ${genre.title}`}
                movies={genreMovies[genre.key] || []}
                onMovieClick={handleMovieOpen}
              />
            ))}
          </>
        )}

        <Footer />
      </main>

      {selectedMovie && (
        <div className="movie-modal-backdrop" onClick={closeMovieModal}>
          <div
            className="movie-modal-bg"
            style={{ backgroundImage: `url(${details?.backdrop_path ? `https://image.tmdb.org/t/p/w780${details.backdrop_path}` : poster})` }}
          />
          <div className={`movie-modal ${showPlayer ? 'player-mode' : ''}`} onClick={(e) => e.stopPropagation()}>
            <button type="button" className="movie-modal-close" onClick={closeMovieModal}>X</button>
            {detailsLoading ? (
              <p>Loading latest movie details...</p>
            ) : (
              <>
                {!showPlayer ? (
                  <>
                    <img src={poster} alt={details?.title} />
                    <div className="movie-modal-content">
                      <h2>{details?.title}</h2>
                      <p><strong>Rating:</strong> {Number(details?.rating || 0).toFixed(2)}</p>
                      <p><strong>Language:</strong> {detailsLanguage}</p>
                      <p><strong>Release:</strong> {details?.release_date || 'Unknown'}</p>
                      <p><strong>Runtime:</strong> {details?.runtime ? `${details.runtime} min` : 'N/A'}</p>
                      <p><strong>Genres:</strong> {Array.isArray(details?.genres) ? details.genres.join(', ') : 'N/A'}</p>
                      <p className="movie-modal-overview">{details?.overview || 'No description available.'}</p>
                      <div className="movie-modal-actions">
                        <button
                          type="button"
                          onClick={() => setShowPlayer(true)}
                        >
                          Watch Now
                        </button>
                        <button type="button" onClick={handleRequestDubbing} disabled={actionLoading}>
                          {actionLoading ? 'Please wait...' : `Request Dubbing (${preferredLang})`}
                        </button>
                        <button type="button" onClick={handleAddWatchlist} disabled={actionLoading}>
                          {actionLoading ? 'Please wait...' : 'Add Watchlist'}
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="movie-player-wrap">
                    {trailerKey ? (
                      <iframe
                        title={`${details?.title} trailer`}
                        src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    ) : (
                      <p>Trailer not available for this movie.</p>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
