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

FALLBACK_POSTERS = [
    "/qNBAXBIQlnOThrVvA6mA2B5ggV6.jpg",
    "/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
    "/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg",
    "/9Gtg2DzBhmYamXBS1hKAhiwbBKS.jpg",
    "/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg",
]


def _request(path: str, params: dict[str, Any]) -> dict[str, Any]:
    if not settings.tmdb_api_key:
        return {"results": []}

    merged_params = {"api_key": settings.tmdb_api_key, **params}
    try:
        response = requests.get(f"{BASE_URL}{path}", params=merged_params, timeout=10)
        response.raise_for_status()
        return response.json()
    except requests.RequestException:
        # Fallback mode keeps the app usable when TMDB is blocked/unavailable.
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
        "genre_ids": movie.get("genre_ids", []),
    }


def _fallback_movies(language_code: str, category: str = "Trending") -> list[dict[str, Any]]:
    prefix = language_code.split("-")[0].upper()
    items: list[dict[str, Any]] = []
    for idx in range(1, 11):
        items.append(
            {
                "id": int(f"{abs(hash(language_code + category)) % 9000}{idx}"),
                "title": f"{category} {prefix} Movie {idx}",
                "overview": "Sample movie shown because TMDB is currently unavailable.",
                "poster_path": FALLBACK_POSTERS[(idx - 1) % len(FALLBACK_POSTERS)],
                "backdrop_path": None,
                "release_date": f"2026-0{(idx % 9) + 1}-01",
                "rating": 7.0 + (idx % 3) * 0.3,
                "genre_ids": [18, 28],
            }
        )
    return items


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
    data = _request("/trending/movie/week", {"language": language, "page": page})
    results = [_movie_card(item) for item in data.get("results", [])]
    return results or _fallback_movies(language, "Trending")


def get_upcoming_movies(language: str = "en-US", region: str = "US", page: int = 1) -> list[dict[str, Any]]:
    data = _request("/movie/upcoming", {"language": language, "region": region, "page": page})
    results = [_movie_card(item) for item in data.get("results", [])]
    return results or _fallback_movies(language, "Upcoming")


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
            "vote_count.gte": 100,
            "include_adult": False,
            "primary_release_date.lte": today,
            "page": page,
        },
    )
    results = [_movie_card(item) for item in data.get("results", [])]
    return results or _fallback_movies(ui_language, f"{original_language.upper()} Best")


def get_new_release_movies(language: str = "en-US", region: str = "US", page: int = 1) -> list[dict[str, Any]]:
    data = _request("/movie/now_playing", {"language": language, "region": region, "page": page})
    results = [_movie_card(item) for item in data.get("results", [])]
    return results or _fallback_movies(language, "New Release")


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
    return results or [movie for movie in _fallback_movies(language, "Search") if query.lower() in movie["title"].lower()]


def get_movie_details(movie_id: int, language: str = "en-US") -> dict[str, Any]:
    movie = _request(f"/movie/{movie_id}", {"language": language})
    if not movie.get("id"):
        fallback = _fallback_movies(language, "Movie")
        item = next((x for x in fallback if x["id"] == movie_id), fallback[0])
        return {
            "id": item["id"],
            "title": item["title"],
            "overview": item["overview"],
            "poster_path": item["poster_path"],
            "backdrop_path": item["backdrop_path"],
            "release_date": item["release_date"],
            "rating": item["rating"],
            "runtime": 120,
            "genres": ["Drama", "Action"],
        }
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
    results = [_movie_card(item) for item in data.get("results", [])]
    return results or _fallback_movies(language, f"Popular {region}")
