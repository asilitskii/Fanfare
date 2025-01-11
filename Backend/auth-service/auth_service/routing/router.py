from typing import Optional

from fastapi import APIRouter, HTTPException
from starlette.status import HTTP_400_BAD_REQUEST, HTTP_401_UNAUTHORIZED, HTTP_200_OK
from structlog import get_logger

from auth_service.service_dependencies import (
    UserServiceDep,
    JwtServiceDep,
    BlacklistedTokensServiceDep,
)
from auth_service.models import (
    LoginFormModel,
    TokensResponseModel,
    DetailResponseModel,
    RefreshTokenBodyModel,
)
from auth_service.services.blacklisted_token import TokenAlreadyBlacklistedException
from auth_service.services.jwt import (
    SignatureException,
    ExpiredTokenException,
    InvalidTokenException,
    TokenPayload,
)
from .auth_dependencies import (
    WhiteListedRefreshToken,
    WhiteListedAccessToken,
    AccessToken,
)
from auth_service.services.user.models import (
    SearchUserResponseModel,
    SearchUserByIdResponseModel,
)

logger = get_logger()
router = APIRouter(prefix="/auth")


@router.post(
    path="/login",
    operation_id="post_login",
    description="Authenticate user with email and password: returns access and refresh tokens.",
    responses={
        HTTP_200_OK: {
            "description": "Successful authentication",
        },
        HTTP_400_BAD_REQUEST: {
            "description": "Incorrect email or password (user with this email and this password doesn't exist)",
            "model": DetailResponseModel,
            "content": {
                "application/json": {
                    "example": {"detail": "incorrect email or password"}
                }
            },
        },
    },
)
async def login(
    form: LoginFormModel, jwt_service: JwtServiceDep, user_service: UserServiceDep
) -> TokensResponseModel:
    user_search_result: Optional[SearchUserResponseModel] = (
        await user_service.find_user(email=form.email, password=form.password)
    )

    if user_search_result is None:
        raise HTTPException(
            status_code=HTTP_400_BAD_REQUEST, detail="incorrect email or password"
        )

    user_id: str = user_search_result.user_id

    access_token: str = jwt_service.encode_access_token(
        sub=user_id, is_seller=user_search_result.is_seller
    )
    refresh_token: str = jwt_service.encode_refresh_token(sub=user_id)

    return TokensResponseModel(
        access_token=access_token,
        refresh_token=refresh_token,
        detail="successful login",
    )


@router.post(
    path="/logout",
    operation_id="post_logout",
    description="Accepts both access and refresh tokens and if they are valid, marks them as black-listed (separately).",
    responses={
        HTTP_200_OK: {
            "description": "Successful logout",
        },
    },
)
async def logout(
    access_token: AccessToken,
    body: RefreshTokenBodyModel,
    jwt_service: JwtServiceDep,
    blacklisted_token_service: BlacklistedTokensServiceDep,
) -> DetailResponseModel:
    refresh_token: str = body.refresh_token

    try:
        jwt_service.decode_refresh_token(refresh_token)
        await blacklisted_token_service.save_refresh_token(refresh_token)
    except (
        SignatureException,
        ExpiredTokenException,
        InvalidTokenException,
        TokenAlreadyBlacklistedException,
    ):
        pass

    try:
        jwt_service.decode_access_token(access_token)
        await blacklisted_token_service.save_access_token(access_token)
    except (
        SignatureException,
        ExpiredTokenException,
        InvalidTokenException,
        TokenAlreadyBlacklistedException,
    ):
        pass

    return DetailResponseModel(detail="successful logout")


@router.post(
    path="/refresh",
    operation_id="post_refresh",
    description="Uses refresh token to get new access and refresh tokens. "
    "Marks old refresh token as black-listed until it expires.",
    responses={
        HTTP_200_OK: {
            "description": "Successful refresh",
        },
        HTTP_401_UNAUTHORIZED: {
            "description": "Refresh token is invalid",
            "model": DetailResponseModel,
            "content": {
                "application/json": {"example": {"detail": "refresh token expired"}}
            },
        },
    },
)
async def refresh(
    refresh_token: WhiteListedRefreshToken,
    jwt_service: JwtServiceDep,
    blacklisted_token_service: BlacklistedTokensServiceDep,
    user_service: UserServiceDep,
) -> TokensResponseModel:
    try:
        payload: TokenPayload = jwt_service.decode_refresh_token(refresh_token)
    except SignatureException:
        raise HTTPException(
            status_code=HTTP_401_UNAUTHORIZED, detail="invalid refresh token signature"
        )
    except ExpiredTokenException:
        raise HTTPException(
            status_code=HTTP_401_UNAUTHORIZED, detail="refresh token expired"
        )
    except InvalidTokenException:
        raise HTTPException(
            status_code=HTTP_401_UNAUTHORIZED, detail="invalid refresh token"
        )

    try:
        await blacklisted_token_service.save_refresh_token(refresh_token)
    except TokenAlreadyBlacklistedException:
        pass

    user_id: str = str(payload.sub)

    user_search_result: Optional[SearchUserByIdResponseModel] = (
        await user_service.find_user_by_id(user_id=user_id)
    )

    # User was not found by id, it means that refresh token contained invalid user id
    if user_search_result is None:
        raise HTTPException(
            status_code=HTTP_401_UNAUTHORIZED, detail="invalid refresh token"
        )

    new_access_token: str = jwt_service.encode_access_token(
        user_id, is_seller=user_search_result.is_seller
    )
    new_refresh_token: str = jwt_service.encode_refresh_token(user_id)

    return TokensResponseModel(
        access_token=new_access_token,
        refresh_token=new_refresh_token,
        detail="tokens successfully refreshed",
    )


@router.post(
    path="/validate",
    operation_id="post_validate",
    description="Validates access token in request.",
    responses={
        HTTP_200_OK: {
            "description": "Access token is valid",
        },
        HTTP_401_UNAUTHORIZED: {
            "description": "Access token is invalid",
            "model": DetailResponseModel,
            "content": {
                "application/json": {"example": {"detail": "invalid signature"}}
            },
        },
    },
)
async def validate(
    access_token: WhiteListedAccessToken, jwt_service: JwtServiceDep
) -> DetailResponseModel:
    try:
        jwt_service.decode_access_token(access_token)
    except SignatureException:
        raise HTTPException(
            status_code=HTTP_401_UNAUTHORIZED, detail="invalid signature"
        )
    except ExpiredTokenException:
        raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="expired token")
    except InvalidTokenException:
        raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="invalid token")

    return DetailResponseModel(detail="access token is valid")


@router.post(
    path="/blacklist/access",
    tags=["internal"],
    operation_id="post_blacklist_access_token",
    description="Puts access token to blacklist if it was valid.",
    responses={
        HTTP_200_OK: {
            "description": "Access token is put to blacklist",
        },
        HTTP_401_UNAUTHORIZED: {
            "description": "Access token is invalid",
            "model": DetailResponseModel,
            "content": {
                "application/json": {"example": {"detail": "invalid signature"}}
            },
        },
    },
)
async def blacklist_access_token(
    access_token: WhiteListedAccessToken,
    jwt_service: JwtServiceDep,
    blacklisted_token_service: BlacklistedTokensServiceDep,
) -> DetailResponseModel:
    try:
        jwt_service.decode_access_token(access_token)
        await blacklisted_token_service.save_access_token(access_token)
    except SignatureException:
        raise HTTPException(
            status_code=HTTP_401_UNAUTHORIZED, detail="invalid signature"
        )
    except ExpiredTokenException:
        raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="expired token")
    except InvalidTokenException:
        raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="invalid token")
    except TokenAlreadyBlacklistedException:
        pass

    return DetailResponseModel(detail="success")
