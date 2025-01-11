from user_service.settings import settings
from pydantic import UUID4
from fastapi_mail import FastMail, MessageSchema, MessageType
from fastapi_mail import ConnectionConfig


class EmailSenderService(FastMail):
    def __init__(self, email_config: ConnectionConfig):
        super().__init__(email_config)

    async def send_email(
        self, subject: str, email: str, template_name: str, template_kwargs: dict # type: ignore
    ):
        message = MessageSchema(
            subject=subject,
            recipients=[email],
            template_body=template_kwargs,
            subtype=MessageType.html,
        )
        await self.send_message(message, template_name=template_name)

    async def send_password_reset(self, email: str, code: UUID4):
        await self.send_email( # type: ignore
            subject="Сброс пароля",
            email=email,
            template_name="email_reset_password_template.html",
            template_kwargs={
                "url": settings.password_reset_from_mail_link_template.safe_substitute(
                    code=code
                ),
            },
        )

    async def send_confirmation_email(self, email: str, code: UUID4):
        await self.send_email( # type: ignore
            subject="Подтверждение почты",
            email=email,
            template_name="email_confirm_template.html",
            template_kwargs={
                "url": settings.user_verification_from_mail_link_template.safe_substitute(
                    code=code
                ),
            },
        )
