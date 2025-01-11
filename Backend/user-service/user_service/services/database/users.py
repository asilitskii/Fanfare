from sqlmodel import select
from pydantic import UUID4, EmailStr
from user_service.models import UserCreationModel
from user_service.services.hashing import get_hashed
from user_service.db import UserSchema, Session


class UserDataService:
    def __init__(self, session: Session):
        self.session = session

    def get_user_by_id(self, user_id: UUID4) -> UserSchema | None:
        query = select(UserSchema).where(UserSchema.id == user_id)
        return self.session.exec(query).first()

    def get_verified_user_by_email(self, email: EmailStr) -> UserSchema | None:
        query = select(UserSchema).where(
            UserSchema.email == email, UserSchema.verified == True
        )
        return self.session.exec(query).first()

    def get_verified_user_by_id(self, user_id: UUID4) -> UserSchema | None:
        query = select(UserSchema).where(
            UserSchema.id == user_id, UserSchema.verified == True
        )
        return self.session.exec(query).first()

    def create_user(self, user: UserSchema) -> UserSchema:
        self.session.add(user)
        self.session.commit()
        self.session.refresh(user)
        return user

    def check_user_creation(
        self, creation_data: UserCreationModel
    ) -> UserSchema | None:
        query = select(UserSchema).where(UserSchema.email == creation_data.email)
        user = self.session.exec(query).first()
        if user is None:
            return UserSchema(
                email=creation_data.email,
                password_hash=get_hashed(creation_data.password),
                first_name=creation_data.first_name,
                last_name=creation_data.last_name,
                birth_date=creation_data.birthdate,
            )
        else:
            if user.verified:
                return None
            else:
                user.password_hash = get_hashed(creation_data.password)
                user.first_name = creation_data.first_name
                user.last_name = creation_data.last_name
                user.birth_date = creation_data.birthdate
                return user

    def update_user(self, user: UserSchema) -> UserSchema | None:
        self.session.add(user)
        self.session.commit()
        self.session.refresh(user)
        return user
