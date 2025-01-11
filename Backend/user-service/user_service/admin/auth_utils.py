from datetime import timedelta, timezone, datetime
from typing import Any

import jwt


def encode_jwt(
        data: dict[str, Any], expires_delta: timedelta, secret_key: str, algorithm: str
) -> str:
    expire: datetime = datetime.now(tz=timezone.utc) + expires_delta
    payload: dict[str, Any] = {"exp": expire, **data}
    return jwt.encode(payload=payload, key=secret_key, algorithm=algorithm)


def decode_jwt(
        token: str, secret_key: str, algorithm: str
) -> dict[str, Any]:
    return jwt.decode(
        jwt=token,
        key=secret_key,
        algorithms=[algorithm],
    )
