from sqlmodel import select, and_
from pydantic import UUID4
from order_service.db import Session, BalanceSchema


class UserBalanceService:
    def __init__(self, session: Session):
        self._session = session
    
    def create_balance(self, user_id: UUID4, store_id: str) -> BalanceSchema:
        balance = BalanceSchema(user_id=user_id, store_id=store_id, value=0)
        self._session.add(balance)
        self._session.commit()
        self._session.refresh(balance)
        return balance

    def get_balance(self, user_id: UUID4, store_id: str) -> BalanceSchema:
        query = select(BalanceSchema).where(
            and_(BalanceSchema.store_id == store_id, BalanceSchema.user_id == user_id)
        )
        balance = self._session.exec(query).first()
        if balance is None:
            balance = self.create_balance(user_id, store_id)
        return balance

    def change_balance(
        self, user_id: UUID4, store_id: str, delta: int
    ) -> BalanceSchema:
        query = select(BalanceSchema).where(
            and_(BalanceSchema.store_id == store_id, BalanceSchema.user_id == user_id)
        )
        balance = self._session.exec(query).first()
        if balance is None:
            balance = self.create_balance(user_id, store_id)
        balance.value += delta
        self._session.add(balance)
        self._session.commit()
        self._session.refresh(balance)
        return balance
