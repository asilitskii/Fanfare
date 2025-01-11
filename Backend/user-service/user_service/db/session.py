from sqlmodel import SQLModel, create_engine, Session
from user_service.settings import settings


engine = create_engine(settings.postgres_connection_string)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session
