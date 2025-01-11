from datetime import datetime
from typing import Annotated

from beanie import Document, Indexed
from pydantic import Field


class BlacklistedRefreshToken(Document):
    token: Annotated[str, Indexed(unique=True, name="refresh_token_index")]
    added_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "blacklisted_refresh_tokens"
