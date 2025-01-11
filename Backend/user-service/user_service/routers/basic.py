from datetime import datetime, UTC

from fastapi import HTTPException
from fastapi.routing import APIRouter
from pydantic import UUID4, EmailStr

from user_service.db import ConfirmationCodesSchema
from user_service.dependencies import EmailSenderDep
from user_service.dependencies import TokenDecodedUserIdDep, DbSessionDep
from user_service.models import (
    ReturnDetailModel,
    UserInfoModel,
    UserCreationModel,
    ReturnFoundUserModel,
    ReturnFoundUserByIdModel,
    UserUpdateModel,
    UserPasswordUpdateModel,
    SellerRequestStatus
)
from user_service.services import (
    AccountConfirmationService,
    UserDataService,
    SellerStatusService,
    verify,
    get_hashed,
)

basic_endpoints_router = APIRouter(prefix="/users")


@basic_endpoints_router.get(
    "/me",
    operation_id="get_me_info",
    responses={
        401: {
            "model": ReturnDetailModel,
            "description": "Unauthorized",
        },
        200: {
            "model": UserInfoModel,
            "description": "Success",
        },
    },
)
async def get_current_user_info(
    user_id: TokenDecodedUserIdDep, db_session: DbSessionDep
):
    user_data_service = UserDataService(db_session)
    seller_status_service = SellerStatusService(db_session)

    user = user_data_service.get_user_by_id(user_id)
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")

    last_seller_request = seller_status_service.get_last_seller_request(user_id)
    if last_seller_request is not None:
        seller_request_status = SellerRequestStatus.from_db(last_seller_request.status)
    else:
        seller_request_status = SellerRequestStatus.no_data

    response_data = UserInfoModel(
        first_name=user.first_name,
        last_name=user.last_name,
        birthdate=user.birth_date,
        email=user.email,
        seller_request_status=seller_request_status,
        is_seller=user.seller,
        tg_id=user.tg_id,
        vk_id=user.vk_id,
        created_at=user.created_at,
        updated_at=user.updated_at,
    )
    return response_data


@basic_endpoints_router.post(
    "",
    description="Registers a new user with the specified data and, if successful, sends an email to confirm the account",
    operation_id="post_create_user",
    responses={
        200: {
            "model": ReturnDetailModel,
            "description": "Sends an email to verify the account",
        },
    },
)
async def create_user(
    creation_data: UserCreationModel,
    db_session: DbSessionDep,
    email_sender: EmailSenderDep,
):
    users_db_service = UserDataService(db_session)
    new_user = users_db_service.check_user_creation(creation_data)
    if new_user is None:
        raise HTTPException(status_code=200, detail="Success")
    new_user = users_db_service.create_user(new_user)

    code = AccountConfirmationService(db_session).add_confirmation_code(
        ConfirmationCodesSchema(
            user_id=new_user.id,
        )
    )

    await email_sender.send_confirmation_email(creation_data.email, code.code)

    return ReturnDetailModel(detail="Success")


@basic_endpoints_router.post(
    "/verify-email/{code}",
    description="Finishes user registration. Verify email = verify user",
    operation_id="post_verify_email_with_code",
    responses={
        200: {
            "model": ReturnDetailModel,
            "description": "Email verified",
        },
        410: {
            "model": ReturnDetailModel,
            "description": "Invalid code",
        },
    },
)
async def verify_email(code: UUID4, db_session: DbSessionDep):
    confirmation_data_manager = AccountConfirmationService(db_session)
    confirmation_code = confirmation_data_manager.get_confirmation_code(
        code=code,
    )
    if confirmation_code is None:
        raise HTTPException(status_code=410, detail="Confirmation code not found")
    user_database_service = UserDataService(db_session)
    user = user_database_service.get_user_by_id(confirmation_code.user_id)
    if user is None:
        raise HTTPException(
            status_code=410,
            detail="User not found",
        )

    user.verified = True
    user_database_service.update_user(user)
    confirmation_data_manager.delete_confirmation_code(confirmation_code)

    return ReturnDetailModel(detail="Success")


@basic_endpoints_router.get(
    "/find",
    tags=["internal"],
    description="Searches for a registered user with a verified account by email and password",
    operation_id="get_find_verified_user",
    responses={
        200: {
            "model": ReturnFoundUserModel,
            "description": "User found",
        },
        404: {
            "model": ReturnDetailModel,
            "description": "User not found",
        },
    },
)
def find_verified_user(email: EmailStr, password: str, db_session: DbSessionDep):
    user_database_service = UserDataService(db_session)
    user = user_database_service.get_verified_user_by_email(email)
    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )
    if not verify(password, user.password_hash):
        raise HTTPException(
            status_code=404,
            detail="Wrong password",
        )
    return ReturnFoundUserModel(
        detail="Success", is_seller=user.seller or False, user_id=user.id
    )


@basic_endpoints_router.get(
    "/find/{user_id}",
    tags=["internal"],
    description="Searches for a registered user with a verified account by id",
    operation_id="get_find_verified_user_by_id",
    responses={
        200: {
            "model": ReturnFoundUserByIdModel,
            "description": "User found",
        },
        404: {
            "model": ReturnDetailModel,
            "description": "User nof found",
        },
    },
)
def find_verified_user_by_id(user_id: UUID4, db_session: DbSessionDep):
    user_database_service = UserDataService(db_session)
    user = user_database_service.get_verified_user_by_id(user_id)
    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )
    return ReturnFoundUserByIdModel(detail="Success", is_seller=user.seller)


@basic_endpoints_router.patch(
    "/edit",
    operation_id="patch_edit_user",
    responses={
        200: {
            "model": ReturnDetailModel,
            "description": "Successfully edited",
        },
        401: {
            "model": ReturnDetailModel,
            "description": "Unauthorized",
        },
    },
)
def edit_user_data(
    user_id: TokenDecodedUserIdDep,
    update_info: UserUpdateModel,
    db_session: DbSessionDep,
):
    user_database_service = UserDataService(db_session)
    user = user_database_service.get_user_by_id(user_id)
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")

    is_updated = False
    if update_info.first_name is not None:
        user.first_name = update_info.first_name
        is_updated = True
    if update_info.last_name is not None:
        user.last_name = update_info.last_name
        is_updated = True
    if update_info.birthdate is not None:
        user.birth_date = update_info.birthdate
        is_updated = True

    if is_updated:
        user.updated_at = datetime.now(UTC)
        user_database_service.update_user(user)

    return ReturnDetailModel(detail="Success")


@basic_endpoints_router.patch(
    "/edit-pass",
    operation_id="patch_edit_user_password",
    responses={
        200: {
            "model": ReturnDetailModel,
            "description": "Successfully edited",
        },
        400: {
            "model": ReturnDetailModel,
            "description": "Wrong old password",
        },
        401: {
            "model": ReturnDetailModel,
            "description": "Unauthorized",
        },
    },
)
def edit_user_password(
    user_id: TokenDecodedUserIdDep,
    update_info: UserPasswordUpdateModel,
    db_session: DbSessionDep,
):
    user_database_service = UserDataService(db_session)
    user = user_database_service.get_user_by_id(user_id)
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")

    if not verify(update_info.old_password, user.password_hash):
        raise HTTPException(
            status_code=400,
            detail="Wrong password",
        )

    user.password_hash = get_hashed(update_info.new_password)
    user.updated_at = datetime.now(UTC)

    user_database_service.update_user(user)

    return ReturnDetailModel(detail="Success")
