from pydantic import BaseModel, Field, ConfigDict, UUID4


class JWTPayloadModel(BaseModel):
    user_id: UUID4 = Field(alias="sub")
    model_config = ConfigDict(extra="ignore")
