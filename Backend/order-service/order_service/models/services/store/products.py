from pydantic import BaseModel, HttpUrl, Field, TypeAdapter


class ProductsRequestModel(BaseModel):
    store_id: str


class ProductModel(BaseModel):
    title: str
    price: int
    product_id: str
    logo_url: HttpUrl | None = Field(default=None)


ProductsResponseModel = TypeAdapter(list[ProductModel])
