from typing import Annotated

from fastapi import APIRouter, Path
from fastapi.params import Query
from pydantic import UUID4, NonNegativeInt
from starlette.status import (
    HTTP_200_OK,
    HTTP_404_NOT_FOUND,
    HTTP_403_FORBIDDEN,
    HTTP_400_BAD_REQUEST,
    HTTP_409_CONFLICT,
)
from fastapi.exceptions import HTTPException

from order_service.models.constants import order_id_example
from order_service.models import (
    OrderCreationModel,
    OrderChangeStatusModel,
    SingleOrderInfoModel,
)
from order_service.models.responses import (
    OrderCreatedModel,
    DetailModel,
    UserOrdersModel,
)
from order_service.db.schemas import OrderStatus
from order_service.dependencies import (
    DbSessionDep,
    StoreServiceDep,
    TokenDecodedPayloadDep,
    TokenDecodedUserIdDep,
)
from order_service.services import (
    OrderService,
    UserBalanceService,
)
from order_service.utils import order_schema_to_model, single_order_schema_to_model

order_router = APIRouter(tags=["orders"], prefix="/orders")


@order_router.post(
    path="",
    operation_id="create_order",
    responses={
        HTTP_200_OK: {
            "description": "Order is created",
        },
        HTTP_400_BAD_REQUEST: {
            "description": "Invalid ID of store or products",
            "model": DetailModel,
        },
        HTTP_409_CONFLICT: {
            "description": "Price of order is too high",
            "model": DetailModel,
        },
    },
)
async def create_order(
    db_session: DbSessionDep,
    store_service: StoreServiceDep,
    user_id: TokenDecodedUserIdDep,
    order_creation_model: OrderCreationModel,
) -> OrderCreatedModel:
    balance_service = UserBalanceService(db_session)

    products_id_info_dict = store_service.get_all_products_dict(
        order_creation_model.store_id
    )

    if products_id_info_dict is None:
        raise HTTPException(400, detail="Invalid ID of store")

    total_price = 0
    for product in order_creation_model.products:
        if product.id not in products_id_info_dict:
            raise HTTPException(400, detail="Invalid ID of product")
        total_price += product.count * products_id_info_dict[product.id].price

    user_balance = balance_service.get_balance(user_id, order_creation_model.store_id)
    if total_price > user_balance.value:
        raise HTTPException(409, detail="Price of order is too high")

    order = OrderService(db_session).create_order(
        user_id,
        total_price,
        order_creation_model.store_id,
        order_creation_model.contact_info,
        order_creation_model.delivery_address,
        order_creation_model.products,
        products_id_info_dict,
    )

    balance_service.change_balance(
        user_id,
        order_creation_model.store_id,
        -total_price,
    )

    return OrderCreatedModel(order_id=order.id, order_status=order.status)


@order_router.get(
    path="/active",
    operation_id="get_active_orders",
    description="Returns active orders sorted in descending by creation date. See parameter `ordered_from` for details.",
    summary="Get Active Orders",
    responses={
        HTTP_200_OK: {
            "description": "Success",
        },
        HTTP_403_FORBIDDEN: {
            "description": "Orders from current user's store were requested, but the current user isn't seller (see parameter `ordered_from` for details)",
            "model": DetailModel,
        },
    },
)
async def get_active_orders(
    db_session: DbSessionDep,
    store_service: StoreServiceDep,
    jwt_payload: TokenDecodedPayloadDep,
    ordered_from: Annotated[
        bool,
        Query(
            description="True: returns orders that were ordered from current user's store, False: returns orders that current user ordered"
        ),
    ],
    product_limit: Annotated[
        NonNegativeInt | None,
        Query(description="Max number of products that will be returned in the order"),
    ] = None,
) -> UserOrdersModel:
    order_service = OrderService(db_session)

    user_id = jwt_payload.user_id

    if ordered_from:
        if not jwt_payload.seller:
            raise HTTPException(
                status_code=HTTP_403_FORBIDDEN,
                detail="Order from current user's store were requested, but the current user isn't seller",
            )
        stores = store_service.get_owned_stores_ids(user_id)

        orders = order_service.get_active_orders_by_store_ids(stores)
    else:
        orders = order_service.get_active_orders_by_user_id(user_id)

    return UserOrdersModel(
        orders=[order_schema_to_model(order, product_limit) for order in orders]
    )


@order_router.get(
    path="/archive",
    operation_id="get_archive_orders",
    description="Returns archive orders sorted in descending by creation date. See parameter `ordered_from` for details.",
    summary="Get Archive Orders",
    responses={
        HTTP_200_OK: {
            "description": "Success",
        },
        HTTP_403_FORBIDDEN: {
            "description": "Orders from current user's store were requested, but the current user isn't seller (see parameter `ordered_from` for details)",
            "model": DetailModel,
        },
    },
)
async def get_archive_orders(
    db_session: DbSessionDep,
    store_service: StoreServiceDep,
    jwt_payload: TokenDecodedPayloadDep,
    ordered_from: Annotated[
        bool,
        Query(
            description="True: returns orders that were ordered from current user's store, False: returns orders that current user was ordered"
        ),
    ],
    product_limit: Annotated[
        NonNegativeInt | None,
        Query(description="Max number of products that will be returned in the order"),
    ] = None,
) -> UserOrdersModel:
    order_service = OrderService(db_session)

    user_id = jwt_payload.user_id

    if ordered_from:
        if not jwt_payload.seller:
            raise HTTPException(
                status_code=HTTP_403_FORBIDDEN,
                detail="Order from current user's store were requested, but the current user isn't seller",
            )

        stores = store_service.get_owned_stores_ids(user_id)

        orders = order_service.get_archived_orders_by_store_ids(stores)
    else:
        orders = order_service.get_archived_orders_by_user_id(user_id)

    return UserOrdersModel(
        orders=[order_schema_to_model(order, product_limit) for order in orders]
    )


@order_router.patch(
    path="/{order_id}/status",
    operation_id="change_order_status",
    responses={
        HTTP_200_OK: {
            "description": "Status has changed",
        },
        HTTP_403_FORBIDDEN: {
            "description": "Permission denied",
            "model": DetailModel,
        },
        HTTP_404_NOT_FOUND: {
            "description": "Order not found",
            "model": DetailModel,
        },
    },
)
async def change_order_status(
    db_session: DbSessionDep,
    store_service: StoreServiceDep,
    user_id: TokenDecodedUserIdDep,
    order_change_status_model: OrderChangeStatusModel,
    order_id: UUID4 = Path(example=order_id_example),
) -> DetailModel:
    order_service = OrderService(db_session)

    order = order_service.get_order_by_id(order_id)
    if order is None:
        raise HTTPException(status_code=HTTP_404_NOT_FOUND, detail="Order not found")

    is_seller = store_service.is_user_store_owner(
        order.store_id, user_id
    )

    if order.user_id != user_id and not is_seller:
        raise HTTPException(status_code=HTTP_403_FORBIDDEN, detail="Permission denied")

    order_service.update_order_status(order, order_change_status_model.new_status, is_seller)

    if order_change_status_model.new_status == OrderStatus.canceled:
        UserBalanceService(db_session).change_balance(
            order.user_id, order.store_id, order.total_price
        )

    return DetailModel(detail="Status has changed")


@order_router.get(
    path="/{order_id}",
    operation_id="get_order_info",
    responses={
        HTTP_200_OK: {
            "description": "Successful response",
        },
        HTTP_403_FORBIDDEN: {
            "description": "Permission denied",
            "model": DetailModel,
        },
        HTTP_404_NOT_FOUND: {
            "description": "Order not found",
            "model": DetailModel,
        },
    },
)
async def get_order_info(
    db_session: DbSessionDep,
    store_service: StoreServiceDep,
    user_id: TokenDecodedUserIdDep,
    order_id: UUID4 = Path(example=order_id_example),
) -> SingleOrderInfoModel:
    order = OrderService(db_session).get_order_by_id(order_id)

    if order is None:
        raise HTTPException(status_code=HTTP_404_NOT_FOUND, detail="Order not found")
    
    is_seller = store_service.is_user_store_owner(
        order.store_id, user_id
    )

    if order.user_id != user_id and not is_seller:
        raise HTTPException(status_code=HTTP_403_FORBIDDEN, detail="Permission denied")

    return single_order_schema_to_model(order, is_seller)
