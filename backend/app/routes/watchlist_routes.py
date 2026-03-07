from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.models import User, Watchlist
from app.schemas.watchlist_schema import WatchlistCreateRequest, WatchlistItemResponse
from app.services.watchlist_service import get_watchlist, get_watchlist_item
from app.utils.dependencies import get_current_user

router = APIRouter(prefix="/watchlist", tags=["Watchlist"])


@router.get("", response_model=list[WatchlistItemResponse])
def list_watchlist(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_watchlist(db, current_user.id)


@router.post("", response_model=WatchlistItemResponse, status_code=status.HTTP_201_CREATED)
def add_watchlist_item(
    payload: WatchlistCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    existing = get_watchlist_item(db, current_user.id, payload.movie_id)
    if existing:
        return existing

    item = Watchlist(
        user_id=current_user.id,
        movie_id=payload.movie_id,
        movie_title=payload.movie_title,
        poster_path=payload.poster_path,
        release_date=payload.release_date,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_watchlist_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    item = db.query(Watchlist).filter(Watchlist.id == item_id, Watchlist.user_id == current_user.id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Watchlist item not found.")
    db.delete(item)
    db.commit()

