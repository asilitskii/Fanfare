from contextlib import asynccontextmanager
from typing import Annotated

import structlog
from fastapi import Depends, FastAPI

from auth_service.services.blacklisted_token import BlacklistedTokenService
from auth_service.services.jwt import JwtService, JwtServiceSettings
from auth_service.services.user import UserService
from auth_service.settings import settings

logger = structlog.get_logger()

jwt_service = JwtService(
    settings=JwtServiceSettings.model_validate(settings.dict()),
    structlog_logger=logger,
)
user_service = UserService(
    connection_string=settings.user_service_connection_string,
    structlog_logger=logger,
)
blacklisted_token_service = BlacklistedTokenService(structlog_logger=logger)


def get_jwt_service() -> JwtService:
    return jwt_service


def get_user_service() -> UserService:
    return user_service


def get_blacklisted_token_service() -> BlacklistedTokenService:
    return blacklisted_token_service


JwtServiceDep = Annotated[JwtService, Depends(get_jwt_service)]
UserServiceDep = Annotated[UserService, Depends(get_user_service)]
BlacklistedTokensServiceDep = Annotated[
    BlacklistedTokenService, Depends(get_blacklisted_token_service)
]


@asynccontextmanager
async def lifespan(app_: FastAPI):
    logger.debug("starting of lifespan")
    await user_service.setup()
    await blacklisted_token_service.setup(
        connection_string=settings.mongo_connection_string,
        database_name=settings.mongo_database_name,
    )
    logger.debug("starting of lifespan finished")

    yield

    logger.debug("finishing of lifespan")
    await user_service.dispose()
    await blacklisted_token_service.dispose()
    logger.debug("finishing of lifespan finished")
