from sqlmodel import select, and_
from datetime import datetime, timedelta, UTC
from pydantic import UUID4
from user_service.settings import settings
from user_service.db import Session, PasswordResetCodesSchema


class PasswordResetService:
    def __init__(self, session: Session):
        self.session = session

    def add_password_reset_code(
        self, confirmation_code: PasswordResetCodesSchema
    ) -> PasswordResetCodesSchema:
        self.session.add(confirmation_code)
        self.session.commit()
        self.session.refresh(confirmation_code)
        return confirmation_code

    def get_password_reset_code(
        self, code: UUID4
    ) -> PasswordResetCodesSchema | None:
        query = (
            select(PasswordResetCodesSchema)
            .where(
                and_(
                    PasswordResetCodesSchema.code == code,
                )
            )
            .order_by(PasswordResetCodesSchema.created_at.desc())  # type: ignore
        )
        password_reset_code = self.session.exec(query).first()
        if password_reset_code is not None:
            localized_created_at = password_reset_code.created_at.replace(tzinfo=UTC)
            elapsed = datetime.now(UTC) - localized_created_at
            is_lifetime_expired = elapsed > timedelta(
                minutes=settings.validation_codes_lifetime_minutes
            )
            if is_lifetime_expired:
                password_reset_code = None
        return password_reset_code

    def delete_password_reset_code(
        self, password_reset_code: PasswordResetCodesSchema
    ) -> None:
        self.session.delete(password_reset_code)
        self.session.commit()
