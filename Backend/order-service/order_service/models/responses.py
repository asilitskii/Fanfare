from typing import List, Annotated

from pydantic import BaseModel, Field

from .order_info import OrderInfoModel
from .utils import OrderId
from order_service.db import OrderStatus


class DetailModel(BaseModel):
    detail: str


class OrderCreatedModel(BaseModel):
    order_id: OrderId
    order_status: OrderStatus


class UserOrdersModel(BaseModel):
    orders: List[OrderInfoModel]


class UserBalanceModel(BaseModel):
    balance: Annotated[int, Field(ge=0, description="Balance of user in kopeks")]
