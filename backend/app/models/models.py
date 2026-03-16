from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import relationship

from app.database.session import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    phone = Column(String(20), nullable=False)
    password = Column(String(255), nullable=False)
    language = Column(String(50), nullable=False)
    region = Column(String(50), nullable=False)
    is_admin = Column(Boolean, default=False, nullable=False)
    dark_mode = Column(Boolean, default=False, nullable=False)
    profile_picture = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    watchlist_items = relationship("Watchlist", back_populates="user", cascade="all, delete-orphan")
    support_messages = relationship("SupportMessage", back_populates="user", cascade="all, delete-orphan")


class Watchlist(Base):
    __tablename__ = "watchlist"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    movie_id = Column(Integer, nullable=False)
    movie_title = Column(String(255), nullable=False)
    poster_path = Column(String(255), nullable=True)
    release_date = Column(String(20), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="watchlist_items")


class SupportMessage(Base):
    __tablename__ = "support_messages"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    movie_id = Column(Integer, nullable=True)
    category = Column(String(50), default="support", nullable=False)
    movie_name = Column(String(255), nullable=True)
    preferred_language = Column(String(50), nullable=True)
    message = Column(Text, nullable=False)
    status = Column(String(30), default="processing", nullable=False)
    admin_response = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    resolved_at = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="support_messages")


class MovieDubbedLanguage(Base):
    __tablename__ = "movie_dubbed_languages"
    __table_args__ = (
        UniqueConstraint("movie_id", "language", name="uq_movie_dubbed_language"),
    )

    id = Column(Integer, primary_key=True, index=True)
    movie_id = Column(Integer, nullable=False, index=True)
    language = Column(String(50), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
