import requests
import os

BASE_URL = "https://api.themoviedb.org/3"
API_KEY = os.getenv("8265bd1679663a7ea12ac168da84d2e8")

def get_trending_movies(page=1):
    url = f"{BASE_URL}/trending/movie/week"
    return requests.get(url, params={
        "api_key": API_KEY,
        "page": page
    }).json()

def search_movies(query):
    url = f"{BASE_URL}/search/movie"
    return requests.get(url, params={
        "api_key": API_KEY,
        "query": query
    }).json()

def get_movie_videos(movie_id: int, language: str = "en"):
    url = f"{BASE_URL}/movie/{movie_id}/videos"
    return requests.get(url, params={
        "api_key": API_KEY,
        "language": language
    }).json()