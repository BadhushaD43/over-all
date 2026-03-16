from __future__ import annotations

from datetime import date
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
    "us": "US",
    "uk": "GB",
    "united kingdom": "GB",
    "britain": "GB",
    "england": "GB",
    "europe": "FR",
    "japan": "JP",
    "china": "CN",
}

ORIGINAL_LANGUAGE_NAME_TO_CODE = {
    "english": "en",
    "spanish": "es",
    "french": "fr",
    "german": "de",
    "japanese": "ja",
    "chinese": "zh",
    "tamil": "ta",
}

def _request(path: str, params: dict[str, Any]) -> dict[str, Any]:
    if not settings.tmdb_api_key:
        return {"results": []}

    merged_params = {"api_key": settings.tmdb_api_key, **params}
    try:
        response = requests.get(f"{BASE_URL}{path}", params=merged_params, timeout=10)
        response.raise_for_status()
        return response.json()
    except requests.RequestException:
        return {"results": []}


def _movie_card(movie: dict[str, Any]) -> dict[str, Any]:
    return {
        "id": movie.get("id"),
        "title": movie.get("title") or movie.get("name"),
        "overview": movie.get("overview"),
        "poster_path": movie.get("poster_path"),
        "backdrop_path": movie.get("backdrop_path"),
        "release_date": movie.get("release_date") or movie.get("first_air_date"),
        "rating": movie.get("vote_average"),
        "original_language": movie.get("original_language"),
        "genre_ids": movie.get("genre_ids", []),
    }


def resolve_language_code(language: str) -> str:
    value = (language or "english").strip().lower()
    return LANGUAGE_NAME_TO_CODE.get(value, "en-US")


def resolve_region_code(region: str) -> str:
    value = (region or "usa").strip().lower()
    return REGION_NAME_TO_CODE.get(value, "US")


def resolve_original_language_code(language: str) -> str:
    value = (language or "english").strip().lower()
    if value in ORIGINAL_LANGUAGE_NAME_TO_CODE:
        return ORIGINAL_LANGUAGE_NAME_TO_CODE[value]
    return resolve_language_code(language).split("-")[0].lower()


def get_trending_movies(language: str = "en-US", page: int = 1) -> list[dict[str, Any]]:
    today = date.today().isoformat()
    original_language = language.split("-")[0].lower()
    data = _request(
        "/discover/movie",
        {
            "language": language,
            "with_original_language": original_language,
            "sort_by": "popularity.desc",
            "vote_count.gte": 100,
            "include_adult": False,
            "primary_release_date.lte": today,
            "page": page,
        },
    )
    results = [_movie_card(item) for item in data.get("results", [])]
    return results


def get_upcoming_movies(language: str = "en-US", region: str = "US", page: int = 1) -> list[dict[str, Any]]:
    today = date.today().isoformat()
    original_language = language.split("-")[0].lower()
    data = _request(
        "/discover/movie",
        {
            "language": language,
            "with_original_language": original_language,
            "region": region,
            "sort_by": "popularity.desc",
            "include_adult": False,
            "primary_release_date.gte": today,
            "page": page,
        },
    )
    results = [_movie_card(item) for item in data.get("results", [])]
    return results


def get_best_movies_by_language(language: str = "english", page: int = 1) -> list[dict[str, Any]]:
    original_language = resolve_original_language_code(language)
    ui_language = resolve_language_code(language)
    today = date.today().isoformat()
    data = _request(
        "/discover/movie",
        {
            "language": ui_language,
            "with_original_language": original_language,
            "sort_by": "popularity.desc",
            "vote_count.gte": 10,
            "include_adult": False,
            "primary_release_date.lte": today,
            "page": page,
        },
    )
    results = [_movie_card(item) for item in data.get("results", [])]
    return results


def get_new_release_movies(language: str = "en-US", region: str = "US", page: int = 1) -> list[dict[str, Any]]:
    data = _request("/movie/now_playing", {"language": language, "region": region, "page": page})
    results = [_movie_card(item) for item in data.get("results", [])]
    return results


def get_today_collection_movies(language: str = "en-US", region: str = "US", page: int = 1) -> list[dict[str, Any]]:
    today = date.today().isoformat()
    data = _request(
        "/discover/movie",
        {
            "language": language,
            "region": region,
            "include_adult": False,
            "sort_by": "popularity.desc",
            "vote_count.gte": 30,
            "primary_release_date.gte": today,
            "primary_release_date.lte": today,
            "page": page,
        },
    )
    results = [_movie_card(item) for item in data.get("results", [])]
    return results or get_new_release_movies(language=language, region=region, page=page)


def search_movies(query: str, language: str = "en-US", page: int = 1) -> list[dict[str, Any]]:
    if not query:
        return []
    data = _request("/search/movie", {"query": query, "language": language, "page": page, "include_adult": False})
    results = [_movie_card(item) for item in data.get("results", [])]
    return results


def get_movie_details(movie_id: int, language: str = "en-US") -> dict[str, Any]:
    movie = _request(f"/movie/{movie_id}", {"language": language})
    if not movie.get("id"):
        return {
            "id": movie_id,
            "title": None,
            "overview": None,
            "poster_path": None,
            "backdrop_path": None,
            "release_date": None,
            "rating": None,
            "original_language": None,
            "runtime": None,
            "genres": [],
        }
    return {
        "id": movie.get("id"),
        "title": movie.get("title"),
        "overview": movie.get("overview"),
        "poster_path": movie.get("poster_path"),
        "backdrop_path": movie.get("backdrop_path"),
        "release_date": movie.get("release_date"),
        "rating": movie.get("vote_average"),
        "original_language": movie.get("original_language"),
        "runtime": movie.get("runtime"),
        "genres": [genre.get("name") for genre in movie.get("genres", [])],
    }


def get_movie_videos(movie_id: int, language: str = "en-US") -> list[dict[str, Any]]:
    data = _request(f"/movie/{movie_id}/videos", {"language": language})
    videos = data.get("results", [])
    return [
        {
            "id": item.get("id"),
            "key": item.get("key"),
            "site": item.get("site"),
            "type": item.get("type"),
            "name": item.get("name"),
        }
        for item in videos
        if item.get("key")
    ]


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
    results = [_movie_card(item) for item in data.get("results", [])]
    return results
