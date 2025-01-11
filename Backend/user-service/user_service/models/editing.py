from pydantic import BaseModel, Field, PastDate
from typing import Annotated


class UserUpdateModel(BaseModel):
    birthdate: Annotated[PastDate | None, Field(None)]
    first_name: Annotated[str | None, Field(None, min_length=2, max_length=30)]
    last_name: Annotated[str | None, Field(None, min_length=2, max_length=30)]


_PasswordType = Annotated[str, Field(min_length=8, max_length=64)]


class UserPasswordUpdateModel(BaseModel):
    old_password: _PasswordType
    new_password: _PasswordType


class NewPasswordRequestModel(BaseModel):
    new_password: _PasswordType
