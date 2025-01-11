from .detail_response import DetailResponseModel


class TokensResponseModel(DetailResponseModel):
    access_token: str
    refresh_token: str
