from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv
from pathlib import Path

# explicitly load .env from project root (back folder) so it works regardless of cwd
env_path = Path(__file__).parent.parent / ".env"
if env_path.exists():
    load_dotenv(dotenv_path=env_path)
else:
    # fallback to default behavior
    load_dotenv()

from urllib.parse import quote_plus

# construct URL with proper encoding for special characters in credentials
# environment variables should be DB_USER, DB_PASSWORD, DB_HOST, DB_NAME
user = os.getenv('DB_USER') or ''
password = os.getenv('DB_PASSWORD') or ''
host = os.getenv('DB_HOST') or ''
dbname = os.getenv('DB_NAME') or ''

# validate required settings
if not user or not password or not host or not dbname:
    raise RuntimeError(
        "Database configuration incomplete. Check DB_USER, DB_PASSWORD, DB_HOST, DB_NAME in .env or environment."
    )

# encode user and password to handle symbols like @, :, /, etc.
user_quoted = quote_plus(user)
pass_quoted = quote_plus(password)

DB_URL = (
    f"mysql+pymysql://{user_quoted}:{pass_quoted}@{host}/{dbname}"
)

# ensure database exists, create if necessary
from sqlalchemy import text

try:
    # connect to server without specifying database
    tmp_url = f"mysql+pymysql://{user_quoted}:{pass_quoted}@{host}"
    tmp_engine = create_engine(tmp_url)
    with tmp_engine.connect() as conn:
        conn.execute(text(f"CREATE DATABASE IF NOT EXISTS `{dbname}`"))
        conn.commit()
except Exception as e:
    # log but don't stop execution
    print(f"Warning: could not verify/create database {dbname}: {e}")

engine = create_engine(DB_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()