from pydantic import UUID4
from uuid import uuid4

def generate_code() -> UUID4:
    return uuid4()
