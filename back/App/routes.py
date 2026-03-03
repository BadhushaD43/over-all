from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .database import SessionLocal
from .schemas import WatchlistCreate, UserCreate, UserLogin, Token, UserOut
from . import crud, tmdb_service
from .auth import (
    verify_password,
    create_access_token,
    get_current_user,
    get_password_hash,
    get_db
)

router = APIRouter()

# Auth Routes
@router.post("/auth/register", response_model=UserOut)
def register(user: UserCreate, db: Session = Depends(get_db)):
    """Register a new user"""
    try:
        db_user = crud.get_user_by_email(db, email=user.email)
        if db_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        return crud.create_user(db=db, user=user)
    except HTTPException:
        raise
    except Exception as e:
        print(f"[ERROR] Registration error: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {str(e)}"
        )

@router.post("/auth/login", response_model=Token)
def login(user: UserLogin, db: Session = Depends(get_db)):
    """Login user"""
    try:
        db_user = crud.get_user_by_email(db, email=user.email)
        if not db_user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email not found"
            )
        if not verify_password(user.password, db_user.password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid password"
            )
        
        access_token = create_access_token(data={"sub": db_user.id})
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": db_user
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Login error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database connection failed: {str(e)}"
        )

@router.get("/auth/me", response_model=UserOut)
def get_me(current_user = Depends(get_current_user)):
    """Get current user info"""
    return current_user

@router.put("/auth/language/{language}")
def update_language(language: str, current_user = Depends(get_current_user), db: Session = Depends(get_db)):
    """Update user's preferred language"""
    user = crud.update_user_language(db, current_user.id, language)
    return user

# Movie Routes
@router.get("/trending")
def trending_movies(page: int = 1):
    return tmdb_service.get_trending_movies(page)

@router.get("/search")
def search_movie(q: str):
    return tmdb_service.search_movies(q)

@router.post("/watchlist")
def add_to_watchlist(movie: WatchlistCreate, db: Session = Depends(get_db)):
    return crud.add_movie(db, movie)

@router.get("/watchlist")
def get_watchlist(db: Session = Depends(get_db)):
    return crud.get_watchlist(db)