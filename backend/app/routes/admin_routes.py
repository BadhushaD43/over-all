from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.models import MovieDubbedLanguage, SupportMessage, User, Watchlist
from app.schemas.support_schema import SupportMessageResolveRequest, SupportMessageResponse, SupportMessageStatusRequest
from app.utils.dependencies import require_admin

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/stats")
def get_admin_stats(
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    total_users = db.query(func.count(User.id)).scalar() or 0
    active_users = db.query(func.count(User.id)).filter(User.is_active.is_(True)).scalar() or 0
    watchlist_total = db.query(func.count(Watchlist.id)).scalar() or 0
    users_by_region = (
        db.query(User.region, func.count(User.id))
        .group_by(User.region)
        .order_by(func.count(User.id).desc())
        .all()
    )
    return {
        "total_users": total_users,
        "active_users": active_users,
        "watchlist_items": watchlist_total,
        "users_by_region": [{"region": region, "count": count} for region, count in users_by_region],
    }


@router.get("/support", response_model=list[SupportMessageResponse])
def list_support_messages(
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    return db.query(SupportMessage).order_by(SupportMessage.created_at.desc()).all()


@router.patch("/support/{message_id}/resolve", response_model=SupportMessageResponse)
def resolve_support_message(
    message_id: int,
    payload: SupportMessageResolveRequest,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    message = db.query(SupportMessage).filter(SupportMessage.id == message_id).first()
    if not message:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Support message not found.")

    message.status = "resolved"
    message.admin_response = payload.admin_response
    message.resolved_at = datetime.utcnow()
    db.add(message)
    db.commit()
    db.refresh(message)
    return message


@router.patch("/support/{message_id}/reply", response_model=SupportMessageResponse)
def reply_support_message(
    message_id: int,
    payload: SupportMessageResolveRequest,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    message = db.query(SupportMessage).filter(SupportMessage.id == message_id).first()
    if not message:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Support message not found.")

    if message.status == "resolved":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Chat already resolved.")

    message.status = "processing"
    message.admin_response = payload.admin_response
    message.resolved_at = None
    db.add(message)
    db.commit()
    db.refresh(message)
    return message


@router.patch("/support/{message_id}/status", response_model=SupportMessageResponse)
def update_support_status(
    message_id: int,
    payload: SupportMessageStatusRequest,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    message = db.query(SupportMessage).filter(SupportMessage.id == message_id).first()
    if not message:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Support message not found.")

    message.status = payload.status
    if payload.status == "resolved":
        message.resolved_at = datetime.utcnow()
    else:
        message.resolved_at = None
    db.add(message)
    db.commit()
    db.refresh(message)
    return message


@router.patch("/support/{message_id}/forward-dubbing", response_model=SupportMessageResponse)
def forward_to_dubbing_team(
    message_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    message = db.query(SupportMessage).filter(SupportMessage.id == message_id).first()
    if not message:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Support message not found.")

    message.status = "forwarded_to_dubbing"
    db.add(message)
    db.commit()
    db.refresh(message)
    return message


@router.patch("/support/{message_id}/complete-dubbing", response_model=SupportMessageResponse)
def complete_dubbing_request(
    message_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    message = db.query(SupportMessage).filter(SupportMessage.id == message_id).first()
    if not message:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Support message not found.")
    if not message.movie_id or not message.preferred_language:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Movie ID and preferred language are required to complete dubbing.",
        )

    existing = (
        db.query(MovieDubbedLanguage)
        .filter(
            MovieDubbedLanguage.movie_id == message.movie_id,
            MovieDubbedLanguage.language == message.preferred_language,
        )
        .first()
    )
    if not existing:
        db.add(MovieDubbedLanguage(movie_id=message.movie_id, language=message.preferred_language))

    message.status = "dubbed"
    message.resolved_at = datetime.utcnow()
    db.add(message)
    db.commit()
    db.refresh(message)
    return message
