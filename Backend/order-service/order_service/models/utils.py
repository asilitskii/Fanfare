from typing import Annotated

from pydantic import Field, UUID4

from .constants import (
    max_product_price,
    order_id_example,
    store_id_example,
    product_id_example,
)

OrderId = Annotated[UUID4, Field(examples=[order_id_example])]
OrderPrice = Annotated[int, Field(ge=0, description="Total price of order in kopeks")]

StoreId = Annotated[str, Field(examples=[store_id_example])]

ProductId = Annotated[str, Field(examples=[product_id_example])]
ProductTitle = Annotated[
    str, Field(max_length=128, min_length=1, examples=["My awesome product"])
]
ProductPrice = Annotated[
    int, Field(ge=0, le=max_product_price, description="Price of product in kopeks")
]

UserId = Annotated[UUID4, Field(examples=["cc6ac193-ce1a-44a8-b559-05199bb7cc02"])]
