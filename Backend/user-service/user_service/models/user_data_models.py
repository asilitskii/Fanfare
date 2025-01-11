from pydantic import BaseModel, PastDate, EmailStr, Field
from typing import Annotated
from datetime import datetime
from enum import StrEnum
from user_service.db import SellerRequestStatus as DBSellerRequestStatus

_UserFirstNameType = Annotated[str, Field(min_length=2, max_length=30)]
_UserLastNameType = Annotated[str, Field(min_length=2, max_length=30)]


class UserCreationModel(BaseModel):
    birthdate: PastDate
    email: EmailStr
    password: Annotated[str, Field(min_length=8, max_length=64)]
    first_name: _UserFirstNameType
    last_name: _UserLastNameType


class SellerRequestStatus(StrEnum):
    no_data = "no_data"
    requested = "requested"
    rejected = "rejected"

    @classmethod
    def from_db(cls, status: DBSellerRequestStatus):
        if status == DBSellerRequestStatus.pending:
            return cls.requested
        elif status == DBSellerRequestStatus.rejected:
            return cls.rejected
        else:
            return cls.no_data


class UserInfoModel(BaseModel):
    first_name: _UserFirstNameType
    last_name: _UserLastNameType
    birthdate: PastDate
    email: EmailStr
    seller_request_status: Annotated[SellerRequestStatus, Field(description="Status of the request")]
    is_seller: bool
    vk_id: Annotated[int | None, Field(ge=1)]
    tg_id: Annotated[int | None, Field(ge=1)]
    created_at: Annotated[datetime, Field(description="Date when the user was created")]
    updated_at: Annotated[
        datetime | None, Field(description="Date when the user was last updated")
    ]
