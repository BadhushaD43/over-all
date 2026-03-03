from sqlalchemy.orm import Session
from .models import Watchlist, User
from .schemas import WatchlistCreate, UserCreate
from .auth import get_password_hash

def add_movie(db: Session, movie: WatchlistCreate):
    db_movie = Watchlist(**movie.dict())
    db.add(db_movie)
    db.commit()
    db.refresh(db_movie)
    return db_movie

def get_watchlist(db: Session):
    return db.query(Watchlist).all()

def create_user(db: Session, user: UserCreate):
    """Create a new user"""
    db_user = User(
        username=user.username,
        email=user.email,
        password=get_password_hash(user.password),
        preferred_language=user.preferred_language
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_by_email(db: Session, email: str):
    """Get user by email"""
    return db.query(User).filter(User.email == email).first()

def get_user_by_id(db: Session, user_id: int):
    """Get user by ID"""
    return db.query(User).filter(User.id == user_id).first()

def update_user_language(db: Session, user_id: int, language: str):
    """Update user's preferred language"""
    user = get_user_by_id(db, user_id)
    if user:
        user.preferred_language = language
        db.commit()
        db.refresh(user)
    return user