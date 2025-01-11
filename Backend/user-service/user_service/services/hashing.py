from bcrypt import hashpw, gensalt, checkpw


def get_hashed(string: str) -> str:
    return hashpw(string.encode("utf-8"), gensalt()).decode("utf-8")


def verify(string: str, hashed_string: str) -> bool:
    return checkpw(string.encode("utf-8"), hashed_string.encode("utf-8"))
