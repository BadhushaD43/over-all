from sqlalchemy.orm import Session

from app.models.models import Watchlist


def get_watchlist(db: Session, user_id: int) -> list[Watchlist]:
    return db.query(Watchlist).filter(Watchlist.user_id == user_id).order_by(Watchlist.created_at.desc()).all()


def get_watchlist_item(db: Session, user_id: int, movie_id: int) -> Watchlist | None:
    return db.query(Watchlist).filter(Watchlist.user_id == user_id, Watchlist.movie_id == movie_id).first()

