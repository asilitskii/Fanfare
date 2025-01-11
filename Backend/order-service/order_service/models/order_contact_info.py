from typing import Annotated

from pydantic import BaseModel, Field


class OrderContactInfoModel(BaseModel):
    last_first_name: Annotated[
        str, Field(min_length=5, max_length=61, examples=["Kondrenko Kirill"])
    ]
    phone_number: Annotated[str, Field(examples=["+71234567890"])]
