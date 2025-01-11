class UserServiceException(Exception):
    pass


class UnexpectedResponseStatusException(UserServiceException):
    pass


class InvalidResponseBodyException(UserServiceException):
    pass
