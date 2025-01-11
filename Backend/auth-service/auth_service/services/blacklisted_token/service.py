from typing import Optional

from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from pymongo.errors import DuplicateKeyError

from auth_service.utils import TokenType
from .documents import (
    BlacklistedAccessToken,
    BlacklistedRefreshToken,
    __document_models__,
)
from .exceptions import (
    CheckingTokenException,
    SavingTokenException,
    TokenAlreadyBlacklistedException,
)


class BlacklistedTokenService:
    def __init__(self, structlog_logger) -> None:
        self.__client: Optional[AsyncIOMotorClient] = None
        self.__logger = structlog_logger

    async def setup(self, connection_string: str, database_name: str) -> None:
        self.__logger.debug("setting up blacklisted-token-service")
        self.__logger.debug("connecting to mongodb")

        self.__client = AsyncIOMotorClient(connection_string)
        database = AsyncIOMotorDatabase(client=self.__client, name=database_name)
        await init_beanie(database=database, document_models=__document_models__)

        self.__logger.debug("connected to mongodb and created all collections")
        self.__logger.debug("blacklisted-token-service is set up")

    async def dispose(self) -> None:
        self.__logger.debug("disposing blacklisted-token-service")

        if self.__client is not None:
            self.__client.close()

        self.__logger.debug("blacklisted-token-service is disposed")

    async def save_access_token(self, access_token: str) -> None:
        await self.__save_token(token=access_token, token_type=TokenType.ACCESS)

    async def save_refresh_token(self, refresh_token: str) -> None:
        await self.__save_token(token=refresh_token, token_type=TokenType.REFRESH)

    async def is_access_token_blacklisted(self, access_token: str) -> bool:
        return await self.__check_if_token_blacklisted(
            token=access_token, token_type=TokenType.ACCESS
        )

    async def is_refresh_token_blacklisted(self, refresh_token: str) -> bool:
        return await self.__check_if_token_blacklisted(
            token=refresh_token, token_type=TokenType.REFRESH
        )

    async def __check_if_token_blacklisted(
        self, token: str, token_type: TokenType
    ) -> bool:
        bound = self.__logger.bind(token=token, token_type=token_type)
        bound.debug("checking if token is blacklisted")

        try:
            if token_type == TokenType.REFRESH:
                document = await self.__find_refresh_token(token)
            else:
                document = await self.__find_access_token(token)

            blacklisted: bool = document is not None
            bound.debug("token is successfully checked", blacklisted=blacklisted)
            return blacklisted
        except Exception as e:
            bound.exception("failed to check token")
            raise CheckingTokenException(token) from e

    @staticmethod
    async def __find_access_token(token: str) -> Optional[BlacklistedAccessToken]:
        return await BlacklistedAccessToken.find_one(
            BlacklistedAccessToken.token == token
        )

    @staticmethod
    async def __find_refresh_token(token: str) -> Optional[BlacklistedRefreshToken]:
        return await BlacklistedRefreshToken.find_one(
            BlacklistedRefreshToken.token == token
        )

    async def __save_token(self, token: str, token_type: TokenType) -> None:
        bound = self.__logger.bind(token=token, token_type=token_type)
        bound.debug("saving token to black list")

        try:
            if token_type == TokenType.ACCESS:
                await self.__save_access_token(token)
            else:
                await self.__save_refresh_token(token)
        except DuplicateKeyError as e:
            bound.exception("token is already blacklisted")
            raise TokenAlreadyBlacklistedException() from e
        except Exception as e:
            bound.exception("failed to save token to black list")
            raise SavingTokenException() from e

    @staticmethod
    async def __save_access_token(token: str) -> None:
        blacklisted_access_token = BlacklistedAccessToken(token=token)
        await BlacklistedAccessToken.insert_one(blacklisted_access_token)

    @staticmethod
    async def __save_refresh_token(token: str) -> None:
        blacklisted_refresh_token = BlacklistedRefreshToken(token=token)
        await BlacklistedRefreshToken.insert_one(blacklisted_refresh_token)
