from datetime import timedelta

import jwt
from sqladmin.authentication import AuthenticationBackend
from starlette.requests import Request

from user_service.services.hashing import verify
from user_service.settings import settings
from .auth_utils import encode_jwt, decode_jwt


class AdminAuth(AuthenticationBackend):
    # TODO: прибито, отбить
    __algorithm = "HS256"

    async def login(self, request: Request) -> bool:
        form = await request.form()
        username, password = form["username"], form["password"]

        if not verify(username, settings.admin_username_hash) or not verify(password, settings.admin_password_hash):
            return False

        # TODO: прибито, отбить
        expires_delta = timedelta(weeks=2)

        data = {"admin": True}

        token = encode_jwt(
            data=data,
            expires_delta=expires_delta,
            secret_key=settings.admin_secret_key,
            algorithm=self.__algorithm
        )

        request.session.update({"token": token})

        return True

    async def logout(self, request: Request) -> bool:
        request.session.clear()
        return True

    async def authenticate(self, request: Request) -> bool:
        token = request.session.get("token")

        try:
            payload = decode_jwt(token=token, secret_key=settings.admin_secret_key, algorithm=self.__algorithm)
        except jwt.exceptions.InvalidTokenError:
            return False

        return payload.get("admin", False)
