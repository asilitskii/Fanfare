from typing import Annotated

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict
from fastapi_mail import ConnectionConfig
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

    user_verification_from_mail_link_template: TemplateConvertionType = Template(
        "http://127.0.0.1:8000/users/verify-email/$code"
    )
    password_reset_from_mail_link_template: TemplateConvertionType = Template(
        "http://127.0.0.1:8000/users/reset_password/$code"
    )

    openapi_output_path: Path = SERVICE_PATH / "docs" / "openapi.yaml"

    validation_codes_lifetime_minutes: float = 30

    debug: bool = False

    mail_username: str = "example"
    mail_password: str = "example"
    mail_port: int = 587
    mail_server: str = "smtp.gmail.com"
    mail_from: str = "no-reply@example.com"
    mail_from_name: str = "no-reply"
    mail_starttls: bool = True
    mail_ssl_tls: bool = True
    mail_debug: int = 0
    mail_template_folder: Path | None = None

    admin_username_hash: str
    admin_password_hash: str
    admin_secret_key: str

settings = Settings()

email_config = ConnectionConfig(
    MAIL_USERNAME=settings.mail_username,
    MAIL_PASSWORD=settings.mail_password,
    MAIL_PORT=settings.mail_port,
    MAIL_SERVER=settings.mail_server,
    MAIL_FROM=settings.mail_from,
    MAIL_FROM_NAME=settings.mail_from_name,
    MAIL_STARTTLS=settings.mail_starttls,
    MAIL_SSL_TLS=settings.mail_ssl_tls,
    MAIL_DEBUG=settings.mail_debug,
    TEMPLATE_FOLDER=settings.mail_template_folder
    or Path(__file__).parent / "templates",
)
