from sqlmodel import select, and_
from datetime import datetime, timedelta, UTC
from pydantic import UUID4
from user_service.settings import settings
from user_service.db import Session, ConfirmationCodesSchema


class AccountConfirmationService:
    def __init__(self, session: Session):
        self.session = session

    def add_confirmation_code(
        self, confirmation_code: ConfirmationCodesSchema
    ) -> ConfirmationCodesSchema:
        self.session.add(confirmation_code)
        self.session.commit()
        self.session.refresh(confirmation_code)
        return confirmation_code

    def get_confirmation_code(self, code: UUID4) -> ConfirmationCodesSchema | None:
        query = (
            select(ConfirmationCodesSchema)
            .where(and_(ConfirmationCodesSchema.code == code))
            .order_by(ConfirmationCodesSchema.created_at.desc())  # type: ignore
        )
        confirmation_code = self.session.exec(query).first()
        if confirmation_code is not None:
            localized_created_at = confirmation_code.created_at.replace(tzinfo=UTC)
            elapsed = datetime.now(UTC) - localized_created_at
            is_lifetime_expired = elapsed > timedelta(
                minutes=settings.validation_codes_lifetime_minutes
            )
            if is_lifetime_expired:
                confirmation_code = None
        return confirmation_code

    def delete_confirmation_code(
        self, confirmation_code: ConfirmationCodesSchema
    ) -> None:
        self.session.delete(confirmation_code)
        self.session.commit()
