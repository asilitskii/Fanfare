class TokenException(Exception):
    pass


class InvalidTokenException(TokenException):
    pass


class SignatureException(TokenException):
    pass


class ExpiredTokenException(TokenException):
    pass
