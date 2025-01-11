from pydantic import BaseModel


class UserIsSellerModel(BaseModel):
    is_seller: bool
    detail: str
