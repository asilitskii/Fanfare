from pydantic import BaseModel, UUID4


class ReturnDetailModel(BaseModel):
    detail: str


class ReturnFoundUserModel(ReturnDetailModel):
    user_id: UUID4
    is_seller: bool


class ReturnFoundUserByIdModel(ReturnDetailModel):
    is_seller: bool
