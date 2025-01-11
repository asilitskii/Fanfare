class BlacklistedTokenServiceException(Exception):
    pass


class TokenAlreadyBlacklistedException(BlacklistedTokenServiceException):
    pass


class SavingTokenException(BlacklistedTokenServiceException):
    pass


class CheckingTokenException(BlacklistedTokenServiceException):
    pass
