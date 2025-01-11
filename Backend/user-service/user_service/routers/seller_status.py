from fastapi import HTTPException
from fastapi.routing import APIRouter

from user_service.dependencies import TokenDecodedUserIdDep, DbSessionDep
from user_service.models import (
    ReturnCreateUserSellerRequestModel,
    CreateUserSellerRequestModel,
    ReturnDetailModel,
)
from user_service.services import UserDataService, SellerStatusService

seller_status_router = APIRouter(prefix="/users")


@seller_status_router.post(
    "/seller-status",
    tags=["seller status"],
    operation_id="post_seller_status",
    description="Create a request to the admin for becoming a seller."
    "This request will initiate the process of verifying "
    "and approving the user's seller status",
    responses={
        200: {
            "model": ReturnCreateUserSellerRequestModel,
            "description": "Successfully created request",
        },
        400: {
            "model": ReturnDetailModel,
            "description": "User already seller",
        },
        401: {
            "model": ReturnDetailModel,
            "description": "Unauthorized",
        },
        424: {
            "model": ReturnDetailModel,
            "description": "Pending request already exists",
        },
    },
)
def request_seller_status(
    user_id: TokenDecodedUserIdDep,
    request: CreateUserSellerRequestModel,
    db_session: DbSessionDep,
):
    user_database_service = UserDataService(db_session)
    seller_status_service = SellerStatusService(db_session)

    user = user_database_service.get_user_by_id(user_id)
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")

    if user.seller or seller_status_service.are_approved_requests_exists(user_id):
        raise HTTPException(status_code=400, detail="User already seller")

    if seller_status_service.are_pending_requests_exists(user_id):
        raise HTTPException(status_code=424, detail="Pending request already exists")

    try:
        seller_request = seller_status_service.add_seller_request(
            user_id, request.comment
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return ReturnCreateUserSellerRequestModel(id=seller_request.id)
