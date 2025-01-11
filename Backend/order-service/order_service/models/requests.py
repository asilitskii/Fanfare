from typing import Annotated

from pydantic import BaseModel, Field

from .address import AddressModel
from .constants import min_product_count_in_order
from .order_contact_info import OrderContactInfoModel
from .order_creation_product_model import OrderCreationProductModel
from .utils import StoreId, UserId
from order_service.db import OrderStatus


class OrderCreationModel(BaseModel):
    store_id: StoreId
    products: Annotated[
        list[OrderCreationProductModel], Field(min_length=min_product_count_in_order)
    ]
    delivery_address: AddressModel
    contact_info: OrderContactInfoModel


class OrderChangeStatusModel(BaseModel):
    new_status: OrderStatus


class BalanceChangeModel(BaseModel):
    user_id: UserId
    store_id: StoreId
    delta: Annotated[
        int, Field(gt=0, description="Delta of user balance in hundredths of fanfcoin")
    ]
