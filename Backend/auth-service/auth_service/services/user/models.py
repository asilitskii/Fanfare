from pydantic import BaseModel


class SearchUserResponseModel(BaseModel):
    detail: str
    user_id: str
    is_seller: bool


class SearchUserByIdResponseModel(BaseModel):
    detail: str
    is_seller: bool
