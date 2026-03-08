from fastapi import APIRouter, HTTPException, Query, status
from datetime import datetime, timezone

from app.services.tmdb_service import (
    get_best_movies_by_language,
    get_movie_details,
    get_movie_videos,
    get_new_release_movies,
    get_today_collection_movies,
    get_recommended_by_region,
    get_trending_movies,
    get_upcoming_movies,
    resolve_language_code,
    resolve_region_code,
    search_movies,
)

router = APIRouter(prefix="/movies", tags=["Movies"])


@router.get("/trending")
def list_trending_movies(language: str = Query(default="English"), page: int = Query(default=1, ge=1)):
    return {"results": get_trending_movies(language=resolve_language_code(language), page=page)}


@router.get("/trending-by-language")
def list_trending_movies_by_language(
    languages: str = Query(default="English,Spanish,French,German,Japanese,Chinese,Tamil"),
):
    names = [value.strip() for value in languages.split(",") if value.strip()]
    response: dict[str, list[dict]] = {}
    for name in names:
        response[name] = get_best_movies_by_language(language=name, page=1)[:10]
    return response


@router.get("/upcoming")
def list_upcoming_movies(
    language: str = Query(default="English"),
    region: str = Query(default="USA"),
    page: int = Query(default=1, ge=1),
):
    return {
        "results": get_upcoming_movies(
            language=resolve_language_code(language),
            region=resolve_region_code(region),
            page=page,
        )
    }


@router.get("/new-releases")
def list_new_releases(
    language: str = Query(default="English"),
    region: str = Query(default="USA"),
    page: int = Query(default=1, ge=1),
):
    return {
        "results": get_new_release_movies(
            language=resolve_language_code(language),
            region=resolve_region_code(region),
            page=page,
        )
    }


@router.get("/today-collection")
def list_today_collection(
    language: str = Query(default="English"),
    region: str = Query(default="USA"),
    page: int = Query(default=1, ge=1),
):
    today = datetime.now(timezone.utc).date().isoformat()
    return {
        "source": "TMDB",
        "today_date": today,
        "fetched_at": datetime.now(timezone.utc).isoformat(),
        "results": get_today_collection_movies(
            language=resolve_language_code(language),
            region=resolve_region_code(region),
            page=page,
        ),
    }


@router.get("/search")
def movie_search(
    query: str = Query(min_length=1),
    language: str = Query(default="English"),
    page: int = Query(default=1, ge=1),
):
    return {"results": search_movies(query=query, language=resolve_language_code(language), page=page)}


@router.get("/recommendations")
def region_recommendations(
    language: str = Query(default="English"),
    region: str = Query(default="USA"),
    page: int = Query(default=1, ge=1),
):
    return {
        "results": get_recommended_by_region(
            language=resolve_language_code(language),
            region=resolve_region_code(region),
            page=page,
        )
    }


@router.get("/{movie_id}")
def movie_details(movie_id: int, language: str = Query(default="English")):
    details = get_movie_details(movie_id=movie_id, language=resolve_language_code(language))
    if not details.get("id"):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Movie not found.")
    return details


@router.get("/{movie_id}/videos")
def movie_videos(movie_id: int, language: str = Query(default="English")):
    return {"results": get_movie_videos(movie_id=movie_id, language=resolve_language_code(language))}
