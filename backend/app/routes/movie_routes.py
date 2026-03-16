from fastapi import APIRouter, Depends, Header, HTTPException, Query, status
from datetime import datetime, timezone
from sqlalchemy.orm import Session

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
from app.models.models import MovieDubbedLanguage, User
from app.database.session import get_db
from app.utils.auth import get_user_id_from_token

router = APIRouter(prefix="/movies", tags=["Movies"])

def get_optional_user(
    authorization: str | None = Header(default=None),
    db: Session = Depends(get_db)
) -> User | None:
    if not authorization or not authorization.lower().startswith("bearer "):
        return None
    try:
        token = authorization.split(" ", 1)[1].strip()
        user_id = get_user_id_from_token(token)
        if user_id:
            return db.query(User).filter(User.id == user_id, User.is_active.is_(True)).first()
    except:
        pass
    return None


@router.get("/trending")
def list_trending_movies(
    language: str | None = Query(default=None),
    page: int = Query(default=1, ge=1),
    current_user: User | None = Depends(get_optional_user)
):
    lang = current_user.language if current_user else (language or "English")
    return {"results": get_trending_movies(language=resolve_language_code(lang), page=page)}


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
    language: str | None = Query(default=None),
    region: str | None = Query(default=None),
    page: int = Query(default=1, ge=1),
    current_user: User | None = Depends(get_optional_user)
):
    lang = current_user.language if current_user else (language or "English")
    reg = current_user.region if current_user else (region or "USA")
    return {
        "results": get_upcoming_movies(
            language=resolve_language_code(lang),
            region=resolve_region_code(reg),
            page=page,
        )
    }


@router.get("/new-releases")
def list_new_releases(
    language: str | None = Query(default=None),
    region: str | None = Query(default=None),
    page: int = Query(default=1, ge=1),
    current_user: User | None = Depends(get_optional_user)
):
    lang = current_user.language if current_user else (language or "English")
    reg = current_user.region if current_user else (region or "USA")
    return {
        "results": get_new_release_movies(
            language=resolve_language_code(lang),
            region=resolve_region_code(reg),
            page=page,
        )
    }


@router.get("/today-collection")
def list_today_collection(
    language: str | None = Query(default=None),
    region: str | None = Query(default=None),
    page: int = Query(default=1, ge=1),
    current_user: User | None = Depends(get_optional_user)
):
    lang = current_user.language if current_user else (language or "English")
    reg = current_user.region if current_user else (region or "USA")
    today = datetime.now(timezone.utc).date().isoformat()
    return {
        "source": "TMDB",
        "today_date": today,
        "fetched_at": datetime.now(timezone.utc).isoformat(),
        "results": get_today_collection_movies(
            language=resolve_language_code(lang),
            region=resolve_region_code(reg),
            page=page,
        ),
    }


@router.get("/search")
def movie_search(
    query: str = Query(min_length=1),
    language: str | None = Query(default=None),
    page: int = Query(default=1, ge=1),
    current_user: User | None = Depends(get_optional_user)
):
    lang = current_user.language if current_user else (language or "English")
    return {"results": search_movies(query=query, language=resolve_language_code(lang), page=page)}


@router.get("/recommendations")
def region_recommendations(
    language: str | None = Query(default=None),
    region: str | None = Query(default=None),
    page: int = Query(default=1, ge=1),
    current_user: User | None = Depends(get_optional_user)
):
    lang = current_user.language if current_user else (language or "English")
    reg = current_user.region if current_user else (region or "USA")
    return {
        "results": get_recommended_by_region(
            language=resolve_language_code(lang),
            region=resolve_region_code(reg),
            page=page,
        )
    }


@router.get("/{movie_id}")
def movie_details(
    movie_id: int,
    language: str | None = Query(default=None),
    current_user: User | None = Depends(get_optional_user),
    db: Session = Depends(get_db),
):
    lang = current_user.language if current_user else (language or "English")
    details = get_movie_details(movie_id=movie_id, language=resolve_language_code(lang))
    if not details.get("id"):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Movie not found.")
    dubbed = (
        db.query(MovieDubbedLanguage.language)
        .filter(MovieDubbedLanguage.movie_id == movie_id)
        .all()
    )
    details["dubbed_languages"] = [row[0] for row in dubbed]
    return details


@router.get("/{movie_id}/videos")
def movie_videos(
    movie_id: int,
    language: str | None = Query(default=None),
    current_user: User | None = Depends(get_optional_user)
):
    lang = current_user.language if current_user else (language or "English")
    return {"results": get_movie_videos(movie_id=movie_id, language=resolve_language_code(lang))}
