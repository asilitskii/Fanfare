from typing import Annotated, Optional

from pydantic import BaseModel, Field


class AddressModel(BaseModel):
    city: Annotated[str, Field(min_length=2, max_length=64)]
    street: Annotated[str, Field(min_length=2, max_length=64)]
    house: Annotated[str, Field(max_length=7)]
    apartment: Annotated[Optional[str], Field(max_length=4)]
    postal_code: Annotated[str, Field(min_length=6, max_length=6, examples=["630090"])]
