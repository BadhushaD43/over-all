const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000/api';

const request = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers.Authorization = `Bearer ${token}`;
  
  const response = await fetch(`${API_BASE}${url}`, { ...options, headers });
  if (!response.ok) {
    let message = response.statusText;
    try {
      const errorData = await response.json();
      message = errorData?.detail || message;
    } catch {
      // Keep fallback status text if parsing fails
    }
    throw new Error(message || 'Request failed');
  }
  return response.json();
};

export const login = (email, password) => request('/auth/login', {
  method: 'POST',
  body: JSON.stringify({ email, password })
});

export const signup = (data) => request('/auth/signup', {
  method: 'POST',
  body: JSON.stringify(data)
});

export const getTrendingByLanguage = () => request('/movies/trending-by-language?languages=English,Spanish,French,German,Japanese,Chinese,Tamil');

export const getTrendingMovies = (language = 'English', page = 1) =>
  request(`/movies/trending?language=${encodeURIComponent(language)}&page=${page}`).then((res) => res.results || []);

export const getUpcomingMovies = (language = 'English', region = 'USA', page = 1) =>
  request(`/movies/upcoming?language=${encodeURIComponent(language)}&region=${encodeURIComponent(region)}&page=${page}`)
    .then((res) => res.results || []);

export const getNewReleaseMovies = (language = 'English', region = 'USA', page = 1) =>
  request(`/movies/new-releases?language=${encodeURIComponent(language)}&region=${encodeURIComponent(region)}&page=${page}`)
    .then((res) => res.results || []);

export const getTodayMovieCollection = (language = 'English', region = 'USA', page = 1) =>
  request(`/movies/today-collection?language=${encodeURIComponent(language)}&region=${encodeURIComponent(region)}&page=${page}`);

export const getMyProfile = () => request('/users/me');

export const updateProfile = (data) => request('/users/me', {
  method: 'PUT',
  body: JSON.stringify(data)
});

export const getWatchlist = () => request('/watchlist');

export const addWatchlist = (movie) => request('/watchlist', {
  method: 'POST',
  body: JSON.stringify({ movie_id: movie.id, title: movie.title, poster_path: movie.poster_path })
});

export const deleteWatchlist = (id) => request(`/watchlist/${id}`, { method: 'DELETE' });

export const sendSupportMessage = (message) => request('/support', {
  method: 'POST',
  body: JSON.stringify({ message })
});

export const getAdminStats = () => request('/admin/stats');

export const getSupportMessages = () => request('/admin/support');

export const searchMovies = (query, language = 'English', page = 1) =>
  request(`/movies/search?query=${encodeURIComponent(query)}&language=${encodeURIComponent(language)}&page=${page}`)
    .then((res) => res.results || []);

export const LANGUAGES = ['English', 'Spanish', 'French', 'German', 'Japanese', 'Chinese', 'Tamil'];
