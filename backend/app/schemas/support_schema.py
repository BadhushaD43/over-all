from datetime import datetime

from pydantic import BaseModel, Field


class SupportMessageCreateRequest(BaseModel):
    category: str = Field(default="support", pattern="^(support|dub_request)$")
    message: str = Field(min_length=5)
    movie_id: int | None = None
    movie_name: str | None = None
    preferred_language: str | None = None


class SupportMessageResolveRequest(BaseModel):
    admin_response: str = Field(min_length=2)


class SupportMessageStatusRequest(BaseModel):
    status: str = Field(pattern="^(processing|resolved)$")


class SupportMessageResponse(BaseModel):
    id: int
    user_id: int
    movie_id: int | None
    category: str
    movie_name: str | None
    preferred_language: str | None
    message: str
    status: str
    admin_response: str | None
    created_at: datetime
    resolved_at: datetime | None

    class Config:
        from_attributes = True
