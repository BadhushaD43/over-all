from datetime import datetime

from pydantic import BaseModel, Field


class WatchlistCreateRequest(BaseModel):
    movie_id: int
    movie_title: str = Field(min_length=1, max_length=255)
    poster_path: str | None = None
    release_date: str | None = None


class WatchlistItemResponse(BaseModel):
    id: int
    movie_id: int
    movie_title: str
    poster_path: str | None
    release_date: str | None
    created_at: datetime

    class Config:
        from_attributes = True

