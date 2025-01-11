from typing import Annotated
from pydantic import BaseModel, Field, UUID4


class ReturnCreateUserSellerRequestModel(BaseModel):
    id: UUID4


class CreateUserSellerRequestModel(BaseModel):
    comment: Annotated[str | None, Field(None, max_length=200)]
