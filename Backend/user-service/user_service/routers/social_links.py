from fastapi import HTTPException
from fastapi.routing import APIRouter
from sqlalchemy.exc import IntegrityError

from user_service.dependencies import TokenDecodedUserIdDep, DbSessionDep
from user_service.models import (
    ReturnDetailModel,
    TgIdUpdateModel,
    VkIdUpdateModel,
)
from user_service.services import (
    UserDataService,
)
from psycopg2.errors import UniqueViolation


social_links_router = APIRouter(prefix="/users/social-links")


@social_links_router.patch(
    "/vk",
    tags=["social links"],
    operation_id="patch_update_user_vk_id",
    responses={
        200: {
            "model": ReturnDetailModel,
            "description": "Successful update",
        },
        401: {
            "model": ReturnDetailModel,
            "description": "Unauthorized",
        },
        400: {
            "model": ReturnDetailModel,
            "description": "Somebody already uses this VK ID",
        }
    },
)
def update_vk_id(
        user_id: TokenDecodedUserIdDep,
        vk_details: VkIdUpdateModel,
        db_session: DbSessionDep,
):
    user_database_service = UserDataService(db_session)
    user = user_database_service.get_user_by_id(user_id)
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")

    user.vk_id = vk_details.vk_id

    try:
        user_database_service.update_user(user)
    except IntegrityError as e:
        if isinstance(e.orig, UniqueViolation):
            raise HTTPException(status_code=400, detail="VK ID already exists")
        else:
            raise e

    return ReturnDetailModel(detail="Success")


@social_links_router.delete(
    "/vk",
    tags=["social links"],
    operation_id="delete_user_vk_id",
    responses={
        200: {
            "model": ReturnDetailModel,
            "description": "Deleting successful",
        },
        400: {
            "model": ReturnDetailModel,
            "description": "User doesn't have VK ID",
        },
        401: {
            "model": ReturnDetailModel,
            "description": "Unauthorized",
        },
    },
)
def delete_vk_id(user_id: TokenDecodedUserIdDep, db_session: DbSessionDep):
    user_database_service = UserDataService(db_session)
    user = user_database_service.get_user_by_id(user_id)
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")

    if user.vk_id is None:
        raise HTTPException(status_code=400, detail="VK ID not found")

    user.vk_id = None

    user_database_service.update_user(user)

    return ReturnDetailModel(detail="Success")


@social_links_router.patch(
    "/tg",
    tags=["social links"],
    operation_id="patch_update_user_tg_id",
    responses={
        200: {
            "model": ReturnDetailModel,
            "description": "Successful update",
        },
        401: {
            "model": ReturnDetailModel,
            "description": "Unauthorized",
        },
        400: {
            "model": ReturnDetailModel,
            "description": "Somebody already uses this Telegram ID",
        }
    },
)
def update_telegram_id(
        user_id: TokenDecodedUserIdDep,
        tg_details: TgIdUpdateModel,
        db_session: DbSessionDep,
):
    user_database_service = UserDataService(db_session)
    user = user_database_service.get_user_by_id(user_id)
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")

    try:
        user.tg_id = tg_details.tg_id
    except IntegrityError:
        raise HTTPException(status_code=400, detail="TG ID already exists")

    try:
        user_database_service.update_user(user)
    except IntegrityError as e:
        if isinstance(e.orig, UniqueViolation):
            raise HTTPException(status_code=400, detail="Telegram ID already exists")
        else:
            raise e

    return ReturnDetailModel(detail="Success")


@social_links_router.delete(
    "/tg",
    tags=["social links"],
    operation_id="delete_user_tg_id",
    responses={
        200: {
            "model": ReturnDetailModel,
            "description": "Deleting successful",
        },
        400: {
            "model": ReturnDetailModel,
            "description": "User doesn't have Telegram ID",
        },
        401: {
            "model": ReturnDetailModel,
            "description": "Unauthorized",
        },
    },
)
def delete_telegram_id(user_id: TokenDecodedUserIdDep, db_session: DbSessionDep):
    user_database_service = UserDataService(db_session)
    user = user_database_service.get_user_by_id(user_id)
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")

    if user.tg_id is None:
        raise HTTPException(status_code=400, detail="Telegram ID not found")

    user.tg_id = None

    user_database_service.update_user(user)

    return ReturnDetailModel(detail="Success")
