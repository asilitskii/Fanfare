from pydantic import BaseModel, Field


class DetailResponseModel(BaseModel):
    detail: str = Field()
