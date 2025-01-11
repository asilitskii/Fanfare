from pydantic import BaseModel, PositiveInt

from .utils import ProductId


class OrderCreationProductModel(BaseModel):
    id: ProductId
    count: PositiveInt
