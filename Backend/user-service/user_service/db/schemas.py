from typing import Optional

from sqlmodel import Field, SQLModel, Text, BigInteger, text, Enum, Column, Index, Relationship  # type: ignore
from pydantic import EmailStr, UUID4
from datetime import date, datetime
from enum import StrEnum


_CreatedAtField = Field(
    None,
    sa_column_kwargs={"server_default": text("(NOW() AT TIME ZONE 'UTC')")},
    nullable=False,
)
_UUIDPrimaryField = Field(
    default=None,
    primary_key=True,
    sa_column_kwargs={"server_default": text("GEN_RANDOM_UUID()")},
    nullable=False,
)
_UpdatedAtField = Field(
    default=None,
    nullable=True,
)


class UserSchema(SQLModel, table=True):
    id: UUID4 = _UUIDPrimaryField
    password_hash: str = Field(sa_type=Text, nullable=False)
    first_name: str = Field(max_length=30, nullable=False)
    last_name: str = Field(max_length=30, nullable=False)
    birth_date: date
    email: EmailStr = Field(max_length=128, unique=True, nullable=False)
    vk_id: Optional[int] = Field(default=None, unique=True, sa_type=BigInteger)
    tg_id: Optional[int] = Field(default=None, unique=True, sa_type=BigInteger)
    seller: bool = Field(
        default=False,
        sa_column_kwargs={"server_default": text("FALSE")},
        nullable=False,
    )
    blocked: bool = Field(
        default=False,
        sa_column_kwargs={"server_default": text("FALSE")},
        nullable=False,
    )
    verified: bool = Field(
        default=False,
        sa_column_kwargs={"server_default": text("FALSE")},
        nullable=False,
    )
    created_at: datetime = _CreatedAtField
    updated_at: Optional[datetime] = _UpdatedAtField
    seller_requests: list["SellerRequestsSchema"] = Relationship(back_populates="user")

    __tablename__ = "users"  # type: ignore


_ForeignUserIdPrimaryField = Field(
    primary_key=True,
    foreign_key="users.id",
    nullable=False,
)
_CodeField = Field(
    None,
    primary_key=True,
    sa_column_kwargs={"server_default": text("GEN_RANDOM_UUID()")},
    nullable=False,
)
_CreatedAtPrimaryField = Field(
    None,
    primary_key=True,
    sa_column_kwargs={"server_default": text("(NOW() AT TIME ZONE 'UTC')")},
    nullable=False,
)


class ConfirmationCodesSchema(SQLModel, table=True):
    user_id: UUID4 = _ForeignUserIdPrimaryField
    code: UUID4 = _CodeField
    created_at: datetime = _CreatedAtPrimaryField

    __tablename__ = "confirmation_codes"  # type: ignore


class PasswordResetCodesSchema(SQLModel, table=True):
    user_id: UUID4 = _ForeignUserIdPrimaryField
    code: UUID4 = _CodeField
    created_at: datetime = _CreatedAtPrimaryField

    __tablename__ = "password_reset_codes"  # type: ignore


class SellerRequestStatus(StrEnum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"


class SellerRequestsSchema(SQLModel, table=True):
    id: UUID4 = _UUIDPrimaryField
    user_id: UUID4 = Field(
        foreign_key="users.id",
        nullable=False,
    )
    user: UserSchema = Relationship(back_populates="seller_requests")
    comment: Optional[str] = Field(
        default=None,
        nullable=True,
        max_length=200,
    )
    status: SellerRequestStatus = Field(
        default=SellerRequestStatus.pending,
        sa_column=Column(
            Enum(SellerRequestStatus, name="seller_requests_status"),
            nullable=False,
            server_default=text(f"'{SellerRequestStatus.pending}'")
        ),
    )
    created_at: datetime = _CreatedAtField
    updated_at: Optional[datetime] = _UpdatedAtField

    __tablename__ = "seller_requests"  # type: ignore

    __table_args__ = (
        Index(
            "unique_pending_request_per_user",
            "user_id",
            unique=True,
            postgresql_where=text("status = 'pending' OR status = 'approved'"),
        ),
    )
