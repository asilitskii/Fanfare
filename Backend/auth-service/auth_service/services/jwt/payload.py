from pydantic import BaseModel, UUID4


class TokenPayload(BaseModel):
    sub: UUID4
    exp: int
