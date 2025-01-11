from typing import Annotated

from pydantic import Field, HttpUrl
from pydantic_settings import BaseSettings, SettingsConfigDict
from pathlib import Path
from string import Template
from pydantic.functional_validators import PlainValidator
import logging.config


SERVICE_PATH = Path(__file__).parent

logging.config.fileConfig(SERVICE_PATH.parent / "logging.conf")

TemplateConvertionType = Annotated[Template, PlainValidator(Template, str)]


class Settings(BaseSettings):
    postgres_connection_string: Annotated[
        str, Field(description="Postgres connection string")
    ] = "postgresql+psycopg2://myuser:mypassword@localhost:5432/"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    openapi_output_path: Path = SERVICE_PATH / "docs" / "openapi.yaml"

    store_service_url: HttpUrl = HttpUrl("http://localhost:8001")

    debug: bool = False

settings = Settings()
