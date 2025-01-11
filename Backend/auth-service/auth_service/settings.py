from typing import Annotated

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

SecretKey = Annotated[str, Field(min_length=64)]
PositiveInt = Annotated[int, Field(gt=0)]


class Settings(BaseSettings):
    user_service_connection_string: str

    mongo_connection_string: str
    mongo_database_name: str

    access_token_secret_key: SecretKey
    access_token_expire_minutes: PositiveInt
    access_token_algorithm: str

    refresh_token_secret_key: SecretKey
    refresh_token_expire_days: PositiveInt
    refresh_token_algorithm: str

    dump_openapi_schema: bool = False
    openapi_schema_file_name: str = "openapi.json"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
