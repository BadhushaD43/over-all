const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000/api";

export const LANGUAGE_LABELS = [
  { code: "English", title: "Trending English Movies" },
  { code: "Spanish", title: "Trending Spanish Movies" },
  { code: "French", title: "Trending French Movies" },
  { code: "German", title: "Trending German Movies" },
  { code: "Japanese", title: "Trending Japanese Movies" },
  { code: "Chinese", title: "Trending Chinese Movies" },
  { code: "Tamil", title: "Trending Tamil Movies" },
];

export function getAuthToken() {
  return localStorage.getItem("ott_token");
}

export function setAuthToken(token) {
  localStorage.setItem("ott_token", token);
}

export function clearAuthToken() {
  localStorage.removeItem("ott_token");
}

async function request(path, options = {}, withAuth = false) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (withAuth && getAuthToken()) {
    headers.Authorization = `Bearer ${getAuthToken()}`;
  }

  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Request failed." }));
    throw new Error(error.detail || "Request failed.");
  }
  if (response.status === 204) return null;
  return response.json();
}

export function signup(payload) {
  return request("/auth/signup", { method: "POST", body: JSON.stringify(payload) });
}

export function login(payload) {
  return request("/auth/login", { method: "POST", body: JSON.stringify(payload) });
}

export function getTrendingByLanguage() {
  const languages = LANGUAGE_LABELS.map((x) => x.code).join(",");
  return request(`/movies/trending-by-language?languages=${encodeURIComponent(languages)}`);
}

export function getMovieDetails(id, language = "English") {
  return request(`/movies/${id}?language=${encodeURIComponent(language)}`);
}

export function addWatchlist(movie) {
  return request(
    "/watchlist",
    {
      method: "POST",
      body: JSON.stringify({
        movie_id: movie.id,
        movie_title: movie.title,
        poster_path: movie.poster_path,
        release_date: movie.release_date,
      }),
    },
    true
  );
}

export function getWatchlist() {
  return request("/watchlist", {}, true);
}

export function removeWatchlist(itemId) {
  return request(`/watchlist/${itemId}`, { method: "DELETE" }, true);
}

export function getTrendingMovies(language = 'English', page = 1) {
  return request(`/movies/trending?language=${encodeURIComponent(language)}&page=${page}`)
    .then(data => data.results || []);
}

export function getUpcomingMovies(language = 'English', region = 'USA', page = 1) {
  return request(`/movies/upcoming?language=${encodeURIComponent(language)}&region=${encodeURIComponent(region)}&page=${page}`)
    .then(data => data.results || []);
}

export function getMyProfile() {
  return request("/users/me", {}, true);
}
