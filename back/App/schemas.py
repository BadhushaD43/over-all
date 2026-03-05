from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class WatchlistCreate(BaseModel):
    movie_id: int
    title: str
    rating: float
    poster: str

class WatchlistOut(WatchlistCreate):
    id: int

    class Config:
        from_attributes = True

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    preferred_language: str = "en"

class UserLogin(BaseModel):
    email: str
    password: str

class UserOut(BaseModel):
    id: int
    username: str
    email: str
    profile_photo: Optional[str] = None
    preferred_language: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    username: Optional[str] = None
    profile_photo: Optional[str] = None
    preferred_language: Optional[str] = None

class PasswordChange(BaseModel):
    current_password: str
    new_password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut