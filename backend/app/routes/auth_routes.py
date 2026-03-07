from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.models import User
from app.schemas.auth_schema import AuthResponse, LoginRequest, SignUpRequest
from app.utils.auth import create_token, hash_password, verify_password

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/signup", response_model=AuthResponse)
def signup(payload: SignUpRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered.")

    user = User(
        name=payload.name.strip(),
        email=payload.email,
        phone=payload.phone.strip(),
        password=hash_password(payload.password),
        language=payload.language.strip(),
        region=payload.region.strip(),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_token(user.id)
    return AuthResponse(token=token, user_id=user.id, name=user.name, email=user.email, is_admin=user.is_admin)


@router.post("/login", response_model=AuthResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email, User.is_active.is_(True)).first()
    if not user or not verify_password(payload.password, user.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials.")

    token = create_token(user.id)
    return AuthResponse(token=token, user_id=user.id, name=user.name, email=user.email, is_admin=user.is_admin)

