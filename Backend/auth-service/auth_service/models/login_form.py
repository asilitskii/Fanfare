import re

from pydantic import BaseModel, EmailStr, field_validator, Field

min_password_length = 8
max_password_length = 64
available_chars = re.compile(r"^[a-zA-Z0-9^_=!#$%&()*+-.:'/?@\"`~<>;{},[\]|]*$")
has_capital_letter = re.compile(r"^.*[A-Z].*$")
has_digit = re.compile(r"^.*[0-9].*$")


class LoginFormModel(BaseModel):
    email: EmailStr
    password: str = Field(
        min_length=min_password_length,
        max_length=max_password_length,
        description="must contain at least one digit, at least one capital character and include only next characters: "
        r"a-zA-Z0-9^_=!#$%&()*+-.:'/?@\"`~<>;{},[\]|",
    )

    @field_validator("password")
    def validate_name(cls, value: str) -> str:
        if available_chars.match(value) is None:
            raise ValueError(
                r"Password must only contain next symbols: a-zA-Z0-9^_=!#$%&()*+-.:'/?@\"`~<>;{},[\]|"
            )

        if has_capital_letter.match(value) is None:
            raise ValueError("Password must have at least one capital letter")

        if has_digit.match(value) is None:
            raise ValueError("Password must have at least one digit")

        return value
