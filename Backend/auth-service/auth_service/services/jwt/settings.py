from pydantic import BaseModel


class JwtServiceSettings(BaseModel):
    access_token_secret_key: str
    access_token_expire_minutes: int
    access_token_algorithm: str

    refresh_token_secret_key: str
    refresh_token_expire_days: int
    refresh_token_algorithm: str
