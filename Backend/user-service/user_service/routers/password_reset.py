from fastapi import HTTPException
from fastapi.routing import APIRouter
from pydantic import EmailStr
from pydantic import UUID4

from user_service.db import PasswordResetCodesSchema
from user_service.dependencies import (
    EmailSenderDep,
    DbSessionDep,
)
from user_service.models import (
    ReturnDetailModel,
    NewPasswordRequestModel,
)
from user_service.services import UserDataService, PasswordResetService
from user_service.services.hashing import get_hashed

password_reset_router = APIRouter(prefix="/users")


@password_reset_router.post(
    "/reset-password",
    description="Sends an email to current user to reset the password",
    operation_id="post_send_reset_password_email_with_code",
    responses={
        200: {
            "model": ReturnDetailModel,
            "description": "Email successfully sent or user with this email not found",
        },
    },
)
async def start_password_reset(
        email: EmailStr,
        db_session: DbSessionDep,
        email_sender: EmailSenderDep,
):
    # BUGMAYBE: different types of user id in token payload and in db
    user = UserDataService(db_session).get_verified_user_by_email(email)
    if user is None:
        # User not found, but by API we return 200
        return ReturnDetailModel(detail="Success")

    code = PasswordResetService(db_session).add_password_reset_code(
        PasswordResetCodesSchema(
            user_id=user.id,
        )
    )

    await email_sender.send_password_reset(email=user.email, code=code.code)

    return ReturnDetailModel(detail="Success")


# TODO: change type of code to UUID4
@password_reset_router.post(
    "/reset-password/{code}",
    operation_id="post_reset_password_completion_with_code",
    responses={
        200: {
            "model": ReturnDetailModel,
            "description": "Password successfully reset",
        },
        410: {
            "model": ReturnDetailModel,
            "description": "Invalid code",
        },
    },
)
async def reset_password(
        code: UUID4,
        request: NewPasswordRequestModel,
        db_session: DbSessionDep,
):
    password_reset_manager = PasswordResetService(db_session)
    password_reset_entry = password_reset_manager.get_password_reset_code(
        code=code,
    )
    if password_reset_entry is None:
        raise HTTPException(status_code=410, detail="Password reset code not found")

    user_database_service = UserDataService(db_session)
    # BUGMAYBE: different types of user id in token payload and in db
    user = user_database_service.get_user_by_id(password_reset_entry.user_id)
    if user is None:
        raise HTTPException(
            status_code=410,
            detail="Invalid code",
        )

    user.password_hash = get_hashed(request.new_password)
    user_database_service.update_user(user)
    password_reset_manager.delete_password_reset_code(password_reset_entry)

    return ReturnDetailModel(detail="Success")
