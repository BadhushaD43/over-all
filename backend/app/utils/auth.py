from passlib.context import CryptContext
from uuid import uuid4

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")
_token_store: dict[str, int] = {}


def hash_password(password: str):
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_token(user_id: int) -> str:
    token = str(uuid4())
    _token_store[token] = user_id
    return token


def get_user_id_from_token(token: str) -> int | None:
    return _token_store.get(token)
