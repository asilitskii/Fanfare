from datetime import timedelta, timezone, datetime
from typing import Any, Optional

import jwt
from pydantic_core import ValidationError
from structlog.contextvars import bind_contextvars, unbind_contextvars

from auth_service.utils import TokenType
from .exceptions import SignatureException, ExpiredTokenException, InvalidTokenException
from .payload import TokenPayload
from .settings import JwtServiceSettings


class JwtService:
    def __init__(self, settings: JwtServiceSettings, structlog_logger):
        self.__access_token_secret_key = settings.access_token_secret_key
        self.__access_token_expire_minutes = settings.access_token_expire_minutes
        self.__access_token_algorithm = settings.access_token_algorithm

        self.__refresh_token_secret_key = settings.refresh_token_secret_key
        self.__refresh_token_expire_days = settings.refresh_token_expire_days
        self.__refresh_token_algorithm = settings.refresh_token_algorithm

        self.__logger = structlog_logger

    def encode_access_token(self, sub: str, is_seller: bool) -> str:
        return self.__encode_token(
            sub=sub, token_type=TokenType.ACCESS, is_seller=is_seller
        )

    def encode_refresh_token(self, sub: str) -> str:
        return self.__encode_token(sub=sub, token_type=TokenType.REFRESH)

    def decode_access_token(self, token: str) -> TokenPayload:
        return self.__decode_token(token=token, token_type=TokenType.ACCESS)

    def decode_refresh_token(self, token: str) -> TokenPayload:
        return self.__decode_token(token=token, token_type=TokenType.REFRESH)

    def __encode_token(
        self, sub: str, token_type: TokenType, is_seller: Optional[bool] = None
    ) -> str:
        data: dict[str, Any] = {"sub": sub}
        if is_seller is not None:
            data["seller"] = is_seller

        bound = self.__logger.bind(data=data, token_type=token_type)
        bound.debug("encoding token")

        if token_type == TokenType.ACCESS:
            result = self.__encode_jwt(
                data=data,
                expires_delta=timedelta(minutes=self.__access_token_expire_minutes),
                secret_key=self.__access_token_secret_key,
                algorithm=self.__access_token_algorithm,
            )
        else:
            result = self.__encode_jwt(
                data=data,
                expires_delta=timedelta(days=self.__refresh_token_expire_days),
                secret_key=self.__refresh_token_secret_key,
                algorithm=self.__refresh_token_algorithm,
            )

        bound.debug("encoded token", token=result)

        return result

    def __decode_token(self, token: str, token_type: TokenType) -> TokenPayload:
        bind_contextvars(token=token, token_type=token_type)
        self.__logger.debug("decoding token")

        try:
            payload: dict[str, Any] = self.__decode_jwt(
                token=token,
                secret_key=self.__get_secret_key(token_type),
                algorithm=self.__get_algorithm(token_type),
            )
            self.__logger.debug("token is decoded", **payload)
            return TokenPayload(**payload)
        except ValidationError as e:
            raise InvalidTokenException() from e
        except Exception:
            raise
        finally:
            unbind_contextvars(token)

    def __get_secret_key(self, token_type: TokenType) -> str:
        if token_type == TokenType.ACCESS:
            return self.__access_token_secret_key

        return self.__refresh_token_secret_key

    def __get_algorithm(self, token_type: TokenType) -> str:
        if token_type == TokenType.ACCESS:
            return self.__access_token_algorithm

        return self.__refresh_token_algorithm

    @staticmethod
    def __encode_jwt(
        data: dict[str, Any], expires_delta: timedelta, secret_key: str, algorithm: str
    ) -> str:
        expire: datetime = datetime.now(tz=timezone.utc) + expires_delta
        payload: dict[str, Any] = {"exp": expire, **data}
        return jwt.encode(payload=payload, key=secret_key, algorithm=algorithm)

    def __decode_jwt(
        self, token: str, secret_key: str, algorithm: str
    ) -> dict[str, Any]:
        try:
            return jwt.decode(
                jwt=token,
                key=secret_key,
                algorithms=[algorithm],
                options={
                    "require": ["exp", "sub"],
                },
            )
        except jwt.InvalidSignatureError as e:
            self.__logger.exception("token has invalid signature")
            raise SignatureException() from e
        except jwt.ExpiredSignatureError as e:
            self.__logger.exception("token has expired")
            raise ExpiredTokenException() from e
        except jwt.InvalidTokenError as e:
            self.__logger.exception("token is invalid")
            raise InvalidTokenException() from e
