from typing import Annotated

from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from pydantic import UUID4

from order_service.services import decode_jwt, StoreService
from order_service.db import get_session, Session
from order_service.settings import settings
from order_service.models import JWTPayloadModel

DbSessionDep = Annotated[Session, Depends(get_session)]

_store_service = StoreService(settings.store_service_url)


def get_store_service() -> StoreService:
    return _store_service


StoreServiceDep = Annotated[StoreService, Depends(get_store_service)]

_oauth2_scheme = OAuth2PasswordBearer(tokenUrl="")
AccessToken = Annotated[str, Depends(_oauth2_scheme)]


def get_token_decoded_user_id(token: AccessToken) -> UUID4:
    payload = decode_jwt(token)
    return payload.user_id


def get_token_decoded_payload(token: AccessToken) -> JWTPayloadModel:
    payload = decode_jwt(token)
    return payload


TokenDecodedUserIdDep = Annotated[UUID4, Depends(get_token_decoded_user_id)]
TokenDecodedPayloadDep = Annotated[JWTPayloadModel, Depends(get_token_decoded_payload)]
