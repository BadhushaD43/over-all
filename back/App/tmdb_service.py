import requests
import os
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

BASE_URL = "https://api.themoviedb.org/3"
API_KEY = os.getenv("TMDB_API_KEY", "8265bd1679663a7ea12ac168da84d2e8")

def get_session():
    session = requests.Session()
    retry = Retry(total=3, backoff_factor=0.3, status_forcelist=[500, 502, 503, 504])
    adapter = HTTPAdapter(max_retries=retry)
    session.mount('http://', adapter)
    session.mount('https://', adapter)
    return session

def get_trending_movies(page=1, time_window="week"):
    url = f"{BASE_URL}/trending/movie/{time_window}"
    try:
        session = get_session()
        response = session.get(url, params={"api_key": API_KEY, "page": page}, timeout=10)
        return response.json()
    except Exception as e:
        print(f"Error fetching trending movies: {e}")
        return {"results": []}

def search_movies(query):
    url = f"{BASE_URL}/search/movie"
    try:
        session = get_session()
        response = session.get(url, params={"api_key": API_KEY, "query": query}, timeout=10)
        return response.json()
    except Exception as e:
        print(f"Error searching movies: {e}")
        return {"results": []}

def get_movie_videos(movie_id: int, language: str = "en"):
    url = f"{BASE_URL}/movie/{movie_id}/videos"
    try:
        session = get_session()
        response = session.get(url, params={"api_key": API_KEY, "language": language}, timeout=10)
        return response.json()
    except Exception as e:
        print(f"Error fetching movie videos: {e}")
        return {"results": []}