from pydantic import BaseModel, Field, ConfigDict, UUID4


class JWTPayloadModel(BaseModel):
    seller: bool
    user_id: UUID4 = Field(alias="sub")
    model_config = ConfigDict(extra="ignore")
