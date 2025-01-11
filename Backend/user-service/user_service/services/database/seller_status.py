from sqlmodel import select
from pydantic import UUID4
from user_service.db import SellerRequestsSchema, SellerRequestStatus, Session


class SellerStatusService:
    def __init__(self, session: Session):
        self.session = session

    def are_pending_requests_exists(self, user_id: UUID4) -> bool:
        query = select(SellerRequestsSchema).where(
            SellerRequestsSchema.user_id == user_id,
            SellerRequestsSchema.status == SellerRequestStatus.pending,
        )
        return self.session.exec(query).first() is not None
    
    def are_approved_requests_exists(self, user_id: UUID4) -> bool:
        query = select(SellerRequestsSchema).where(
            SellerRequestsSchema.user_id == user_id,
            SellerRequestsSchema.status == SellerRequestStatus.approved,
        )
        return self.session.exec(query).first() is not None

    def add_seller_request(self, user_id: UUID4, comment: str | None) -> SellerRequestsSchema:
        schema = SellerRequestsSchema(
            user_id=user_id,
            comment=comment,
        )
        self.session.add(schema)
        self.session.commit()
        self.session.refresh(schema)
        return schema
    
    def get_last_seller_request(self, user_id: UUID4) -> SellerRequestsSchema | None:
        query = select(SellerRequestsSchema).where(
            SellerRequestsSchema.user_id == user_id,
        ).order_by(SellerRequestsSchema.created_at.desc())  # type: ignore
        return self.session.exec(query).first()
