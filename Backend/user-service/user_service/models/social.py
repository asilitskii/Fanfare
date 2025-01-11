from typing import Annotated
from pydantic import BaseModel, Field


class VkIdUpdateModel(BaseModel):
    vk_id: Annotated[int, Field(ge=1)]


class TgIdUpdateModel(BaseModel):
    tg_id: Annotated[int, Field(ge=1)]
