from user_service.services import (
    EmailSenderService,
    decode_jwt,
)
from user_service.db import get_session, Session
from user_service.settings import email_config
from fastapi import Depends
from typing import Annotated
from fastapi.security import OAuth2PasswordBearer
from pydantic import UUID4


_email_sender_instance = EmailSenderService(email_config=email_config)


async def get_email_sender() -> EmailSenderService:
    return _email_sender_instance


EmailSenderDep = Annotated[EmailSenderService, Depends(get_email_sender)]

DbSessionDep = Annotated[Session, Depends(get_session)]

_oauth2_scheme = OAuth2PasswordBearer(tokenUrl="")
AccessToken = Annotated[str, Depends(_oauth2_scheme)]


def get_token_decoded_user_id(token: AccessToken) -> UUID4:
    payload = decode_jwt(token)
    return payload.user_id


TokenDecodedUserIdDep = Annotated[UUID4, Depends(get_token_decoded_user_id)]
