from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.models import SupportMessage, User
from app.schemas.support_schema import SupportMessageCreateRequest, SupportMessageResponse
from app.utils.dependencies import get_current_user

router = APIRouter(prefix="/support", tags=["Support"])


@router.get("", response_model=list[SupportMessageResponse])
def list_my_support_messages(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        db.query(SupportMessage)
        .filter(SupportMessage.user_id == current_user.id)
        .order_by(SupportMessage.created_at.desc())
        .all()
    )


@router.post("", response_model=SupportMessageResponse, status_code=status.HTTP_201_CREATED)
def create_support_message(
    payload: SupportMessageCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    support_message = SupportMessage(
        user_id=current_user.id,
        category=payload.category,
        movie_name=payload.movie_name,
        preferred_language=payload.preferred_language,
        message=payload.message,
    )
    db.add(support_message)
    db.commit()
    db.refresh(support_message)
    return support_message

