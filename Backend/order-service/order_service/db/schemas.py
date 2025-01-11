from typing import Optional

from sqlmodel import (
    Field,  # type: ignore
    SQLModel,
    BigInteger,
    text,
    Enum,
    Column,
    Integer,
    Relationship,
    CheckConstraint,
    SmallInteger
)  # type: ignore
from pydantic import UUID4, HttpUrl
from datetime import datetime
from enum import StrEnum
from sqlalchemy.types import TypeDecorator, String
from sqlalchemy.engine.interfaces import Dialect


class OrderStatus(StrEnum):
    created = "created"
    assembly = "assembly"
    on_the_way = "on_the_way"
    awaiting_receipt = "awaiting_receipt"
    received = "received"
    canceled = "canceled"


class HttpUrlType(TypeDecorator[Optional[HttpUrl]]):
    impl = String(2083)
    cache_ok = True
    python_type = Optional[HttpUrl]  # type: ignore

    def process_bind_param(self, value: Optional[HttpUrl], dialect: Dialect) -> Optional[str]:
        if value is None:
            return None
        return str(value)

    def process_result_value(self, value: Optional[str], dialect: Dialect) -> Optional[HttpUrl]:
        if value is None:
            return None
        return HttpUrl(url=value)  # type: ignore

    def process_literal_param(self, value: Optional[HttpUrl], dialect: Dialect) -> str:
        return str(value)


_CreationDateField = Field(
    None,
    sa_column_kwargs={"server_default": text("(NOW() AT TIME ZONE 'UTC')")},
    nullable=False,
)
_UpdateDateField = Field(
    default=None,
    nullable=True,
)
_ReceptionDateField = Field(
    default=None,
    nullable=True,
)


class OrderSchema(SQLModel, table=True):
    id: UUID4 = Field(
        default=None,
        primary_key=True,
        sa_column_kwargs={"server_default": text("GEN_RANDOM_UUID()")},
        nullable=False,
    )
    status: OrderStatus = Field(
        default=OrderStatus.created,
        sa_column=Column(
            Enum(OrderStatus, name="seller_requests_status"),
            nullable=False,
            server_default=text(f"'{OrderStatus.created.name}'"),
        ),
    )
    creation_date: datetime = _CreationDateField
    update_date: Optional[datetime] = _UpdateDateField
    reception_date: Optional[datetime] = _ReceptionDateField
    total_price: int = Field(nullable=False, sa_type=BigInteger)
    store_id: str = Field(max_length=24, nullable=False)
    user_id: UUID4 = Field(nullable=False)

    contact_info: "OrdersContactInfoSchema" = Relationship(back_populates="order")
    products: list["OrdersProductsSchema"] = Relationship(back_populates="order")
    delivery_address: "OrdersDeliveryAddressSchema" = Relationship(
        back_populates="order"
    )

    __table_args__ = (CheckConstraint(f"reception_date IS NULL OR status = '{OrderStatus.received.name}'"),
    )

    __tablename__ = "orders"  # type: ignore


_ForeignOrderIdPrimaryField = Field(
    primary_key=True,
    foreign_key="orders.id",
    nullable=False,
)


class OrdersContactInfoSchema(SQLModel, table=True):
    order_id: UUID4 = _ForeignOrderIdPrimaryField
    last_first_name: str = Field(max_length=61, nullable=False)
    phone_number: str = Field(max_length=15, nullable=False)

    order: OrderSchema = Relationship(back_populates="contact_info")

    __tablename__ = "orders_contact_info"  # type: ignore


class OrdersProductsSchema(SQLModel, table=True):
    order_id: UUID4 = _ForeignOrderIdPrimaryField
    product_id: str = Field(
        max_length=24, nullable=False, primary_key=True
    )
    product_title: str = Field(max_length=128, nullable=False)
    product_price: int = Field(nullable=False, sa_type=Integer)
    product_count: int = Field(nullable=False, gt=0, sa_type=SmallInteger)
    product_logo_url: Optional[HttpUrl] = Field(default=None, max_length=2083, nullable=True, sa_type=HttpUrlType)

    order: OrderSchema = Relationship(back_populates="products")

    __table_args__ = (CheckConstraint('product_count > 0'),)

    __tablename__ = "orders_products"  # type: ignore


class OrdersDeliveryAddressSchema(SQLModel, table=True):
    order_id: UUID4 = _ForeignOrderIdPrimaryField
    city: str = Field(max_length=64, nullable=False)
    street: str = Field(max_length=64, nullable=False)
    house: str = Field(max_length=7, nullable=False)
    apartment: Optional[str] = Field(max_length=4, nullable=True)
    postal_code: str = Field(max_length=6, nullable=False)

    order: OrderSchema = Relationship(back_populates="delivery_address")

    __tablename__ = "orders_delivery_addresses"  # type: ignore


class BalanceSchema(SQLModel, table=True):
    user_id: UUID4 = Field(nullable=False, primary_key=True)
    store_id: str = Field(max_length=24, nullable=False, primary_key=True)
    value: int = Field(nullable=False, ge=0, sa_type=BigInteger)
    
    __table_args__ = (CheckConstraint('value >= 0'),)

    __tablename__ = "balance"  # type: ignore
