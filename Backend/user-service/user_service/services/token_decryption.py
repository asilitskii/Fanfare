from user_service.models import JWTPayloadModel
import jwt


def decode_jwt(token: str) -> JWTPayloadModel:
    decoded_token = jwt.decode(token, options={"verify_signature": False}) # type: ignore
    payload = JWTPayloadModel.model_validate(decoded_token)
    return payload
