from pydantic import BaseModel, PositiveInt, Field
from pydantic import HttpUrl

from .utils import ProductId, ProductTitle, ProductPrice


class ProductModel(BaseModel):
    id: ProductId
    title: ProductTitle
    logo_url: HttpUrl | None = Field(default=None)
    price: ProductPrice
    count: PositiveInt
