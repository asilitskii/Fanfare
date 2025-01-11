from pydantic import BaseModel


class RefreshTokenBodyModel(BaseModel):
    refresh_token: str
