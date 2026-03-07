from __future__ import annotations

from typing import Any

import requests

from app.config.settings import settings

BASE_URL = "https://api.themoviedb.org/3"

LANGUAGE_NAME_TO_CODE = {
    "english": "en-US",
    "spanish": "es-ES",
    "french": "fr-FR",
    "german": "de-DE",
    "japanese": "ja-JP",
    "chinese": "zh-CN",
    "tamil": "ta-IN",
}

REGION_NAME_TO_CODE = {
    "india": "IN",
    "usa": "US",
    "europe": "FR",
    "japan": "JP",
    "china": "CN",
}


def _request(path: str, params: dict[str, Any]) -> dict[str, Any]:
    if not settings.tmdb_api_key:
        return {"results": []}

    merged_params = {"api_key": settings.tmdb_api_key, **params}
    response = requests.get(f"{BASE_URL}{path}", params=merged_params, timeout=10)
    response.raise_for_status()
    return response.json()


def _movie_card(movie: dict[str, Any]) -> dict[str, Any]:
    return {
        "id": movie.get("id"),
        "title": movie.get("title") or movie.get("name"),
        "overview": movie.get("overview"),
        "poster_path": movie.get("poster_path"),
        "backdrop_path": movie.get("backdrop_path"),
        "release_date": movie.get("release_date") or movie.get("first_air_date"),
        "rating": movie.get("vote_average"),
        "genre_ids": movie.get("genre_ids", []),
    }


def resolve_language_code(language: str) -> str:
    value = (language or "english").strip().lower()
    return LANGUAGE_NAME_TO_CODE.get(value, "en-US")


def resolve_region_code(region: str) -> str:
    value = (region or "usa").strip().lower()
    return REGION_NAME_TO_CODE.get(value, "US")


def get_trending_movies(language: str = "en-US", page: int = 1) -> list[dict[str, Any]]:
    data = _request("/trending/movie/week", {"language": language, "page": page})
    return [_movie_card(item) for item in data.get("results", [])]


def get_upcoming_movies(language: str = "en-US", region: str = "US", page: int = 1) -> list[dict[str, Any]]:
    data = _request("/movie/upcoming", {"language": language, "region": region, "page": page})
    return [_movie_card(item) for item in data.get("results", [])]


def search_movies(query: str, language: str = "en-US", page: int = 1) -> list[dict[str, Any]]:
    if not query:
        return []
    data = _request("/search/movie", {"query": query, "language": language, "page": page, "include_adult": False})
    return [_movie_card(item) for item in data.get("results", [])]


def get_movie_details(movie_id: int, language: str = "en-US") -> dict[str, Any]:
    movie = _request(f"/movie/{movie_id}", {"language": language})
    return {
        "id": movie.get("id"),
        "title": movie.get("title"),
        "overview": movie.get("overview"),
        "poster_path": movie.get("poster_path"),
        "backdrop_path": movie.get("backdrop_path"),
        "release_date": movie.get("release_date"),
        "rating": movie.get("vote_average"),
        "runtime": movie.get("runtime"),
        "genres": [genre.get("name") for genre in movie.get("genres", [])],
    }


def get_recommended_by_region(language: str, region: str, page: int = 1) -> list[dict[str, Any]]:
    data = _request(
        "/discover/movie",
        {
            "language": language,
            "region": region,
            "sort_by": "popularity.desc",
            "vote_count.gte": 50,
            "page": page,
        },
    )
    return [_movie_card(item) for item in data.get("results", [])]

