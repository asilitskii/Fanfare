from typing import Annotated

from fastapi import HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from starlette.status import HTTP_401_UNAUTHORIZED

from auth_service.service_dependencies import BlacklistedTokensServiceDep
from auth_service.models import RefreshTokenBodyModel

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")
AccessToken = Annotated[str, Depends(oauth2_scheme)]


async def get_whitelisted_access_token(
    access_token: AccessToken, blacklisted_token_service: BlacklistedTokensServiceDep
) -> str:
    is_blacklisted: bool = await blacklisted_token_service.is_access_token_blacklisted(
        access_token
    )

    if is_blacklisted:
        raise HTTPException(
            HTTP_401_UNAUTHORIZED, detail="access token is black-listed"
        )

    return access_token


async def get_whitelisted_refresh_token(
    body: RefreshTokenBodyModel, blacklisted_token_service: BlacklistedTokensServiceDep
) -> str:
    refresh_token: str = body.refresh_token
    is_blacklisted: bool = await blacklisted_token_service.is_refresh_token_blacklisted(
        refresh_token
    )

    if is_blacklisted:
        raise HTTPException(
            HTTP_401_UNAUTHORIZED, detail="refresh token is black-listed"
        )

    return refresh_token


WhiteListedAccessToken = Annotated[str, Depends(get_whitelisted_access_token)]
WhiteListedRefreshToken = Annotated[str, Depends(get_whitelisted_refresh_token)]
