from typing import Optional, Any

import aiohttp

from .exceptions import UnexpectedResponseStatusException, InvalidResponseBodyException
from .models import SearchUserByIdResponseModel, SearchUserResponseModel


class UserService:
    def __init__(self, connection_string: str, structlog_logger):
        self.__connection_string = connection_string
        self.__session: Optional[aiohttp.ClientSession] = None
        self.__logger = structlog_logger

    async def setup(self) -> None:
        self.__logger.debug("setting up user-service")
        self.__session = aiohttp.ClientSession()
        self.__logger.debug("user-service is set up")

    async def dispose(self) -> None:
        self.__logger.debug("disposing user-service")

        if self.__session is not None:
            await self.__session.close()

        self.__logger.debug("user-service is disposed")

    async def find_user(
        self, email: str, password: str
    ) -> Optional[SearchUserResponseModel]:
        if self.__session is None:
            return None

        url: str = f"{self.__connection_string}/find"
        params: dict[str, Any] = {
            "email": email,
            "password": password,
        }

        bound = self.__logger.bind(email=email, password=password)
        bound.debug("making search request")

        async with self.__session.get(url=url, params=params) as response:
            status: int = response.status

            if status == 404:
                bound.debug("service got 404")
                return None

            if not response.ok:
                bound.critical("service got unexpected http-status", http_status=status)
                raise UnexpectedResponseStatusException()

            try:
                bound.debug("parsing search response")
                json_body: dict[str, Any] = await response.json()
                result = SearchUserResponseModel.model_validate(json_body)
                bound.debug("parsing successful: user found", result=result)
                return result
            except Exception as e:
                bound.critical("received invalid response")
                raise InvalidResponseBodyException() from e

    async def find_user_by_id(
        self, user_id: str
    ) -> Optional[SearchUserByIdResponseModel]:
        if self.__session is None:
            return None

        url: str = f"{self.__connection_string}/find/{user_id}"

        bound = self.__logger.bind(user_id=user_id)
        bound.debug("making search request")

        async with self.__session.get(url=url) as response:
            status: int = response.status

            if status == 404:
                bound.debug("service got 404")
                return None

            if not response.ok:
                bound.critical("service got unexpected http-status", http_status=status)
                raise UnexpectedResponseStatusException()

            try:
                bound.debug("parsing search response")
                json_body: dict[str, Any] = await response.json()
                result = SearchUserByIdResponseModel.model_validate(json_body)
                bound.debug("parsing successful: user found", result=result)
                return result
            except Exception as e:
                bound.critical("received invalid response")
                raise InvalidResponseBodyException() from e
