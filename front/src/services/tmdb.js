const API_KEY = "8265bd1679663a7ea12ac168da84d2e8";
const BASE_URL = "https://api.themoviedb.org/3";

export const fetchTrending = async () => {
  const res = await fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`);
  return res.json();
};

export const searchMovies = async (query) => {
  const res = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`);
  return res.json();
};

export const fetchGenres = async () => {
  const res = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
  return res.json();
};
