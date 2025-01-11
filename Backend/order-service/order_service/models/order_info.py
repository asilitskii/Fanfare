from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field

from .address import AddressModel
from .order_contact_info import OrderContactInfoModel
from .product import ProductModel
from .utils import StoreId, OrderPrice, OrderId
from order_service.db import OrderStatus


class OrderInfoModel(BaseModel):
    store_id: StoreId
    order_id: OrderId
    total_price: OrderPrice
    status: OrderStatus
    order_creation_timestamp: datetime
    order_reception_timestamp: Optional[datetime]
    products: list[ProductModel] = Field(description="products are sorted in descending of their prices")
    delivery_address: AddressModel
    contact_info: OrderContactInfoModel

class SingleOrderInfoModel(OrderInfoModel):
    is_seller: bool
