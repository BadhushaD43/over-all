from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, text
from sqlalchemy.engine.url import make_url

from app.config.settings import settings
from app.database.session import Base, SessionLocal, engine
from app.models.models import User
from app.routes.admin_routes import router as admin_router
from app.routes.auth_routes import router as auth_router
from app.routes.movie_routes import router as movie_router
from app.routes.support_routes import router as support_router
from app.routes.user_routes import router as user_router
from app.routes.watchlist_routes import router as watchlist_router
from app.utils.auth import hash_password

app = FastAPI(title="OTT Streaming Platform API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in settings.cors_origins.split(",") if origin.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api")
app.include_router(movie_router, prefix="/api")
app.include_router(user_router, prefix="/api")
app.include_router(watchlist_router, prefix="/api")
app.include_router(support_router, prefix="/api")
app.include_router(admin_router, prefix="/api")


@app.get("/api/health")
def health_check():
    return {"status": "ok"}


def ensure_database_exists():
    url = make_url(settings.database_url)
    if not url.drivername.startswith("mysql") or not url.database:
        return

    admin_engine = create_engine(url.set(database=""))
    db_name = url.database.replace("`", "``")
    try:
        with admin_engine.begin() as conn:
            conn.execute(
                text(
                    f"CREATE DATABASE IF NOT EXISTS `{db_name}` "
                    "CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"
                )
            )
    finally:
        admin_engine.dispose()


@app.on_event("startup")
def startup_event():
    ensure_database_exists()
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        admin = db.query(User).filter(User.email == settings.default_admin_email).first()
        if not admin:
            db.add(
                User(
                    name="Platform Admin",
                    email=settings.default_admin_email,
                    phone="9999999999",
                    password=hash_password(settings.default_admin_password),
                    language="English",
                    region="USA",
                    is_admin=True,
                )
            )
            db.commit()
    finally:
        db.close()
