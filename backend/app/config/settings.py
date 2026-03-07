import os
from dataclasses import dataclass

from dotenv import load_dotenv

load_dotenv()


@dataclass(frozen=True)
class Settings:
    database_url: str = os.getenv("DATABASE_URL", "sqlite:///./ott.db")
    secret_key: str = os.getenv("SECRET_KEY", "dev-secret-key")
    tmdb_api_key: str = os.getenv("TMDB_API_KEY", "")
    cors_origins: str = os.getenv("CORS_ORIGINS", "http://localhost:5173")
    default_admin_email: str = os.getenv("DEFAULT_ADMIN_EMAIL", "admin@ottstream.com")
    default_admin_password: str = os.getenv("DEFAULT_ADMIN_PASSWORD", "Admin@123")


settings = Settings()
