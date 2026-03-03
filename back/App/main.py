from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import router

app = FastAPI(title="TMDB Backend API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to specific origin in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# create database tables automatically on startup
from . import models  # noqa: F401  # ensures models are registered with SQLAlchemy
from .database import engine

@app.on_event("startup")
def create_tables():
    """Create all tables if they don't already exist."""
    try:
        models.Base.metadata.create_all(bind=engine)
        print("[startup] database tables checked/created")
    except Exception as exc:
        print(f"[startup] error creating tables: {exc}")
        raise

app.include_router(router)