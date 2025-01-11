from typing import Annotated

from fastapi import APIRouter
from fastapi.params import Query
from starlette.status import HTTP_200_OK

from order_service.models.constants import store_id_example
from order_service.models.requests import BalanceChangeModel
from order_service.models.responses import UserBalanceModel, DetailModel
from order_service.dependencies import TokenDecodedUserIdDep, DbSessionDep
from order_service.services import UserBalanceService

balance_router = APIRouter(prefix="/balances")


@balance_router.get(
    path="",
    operation_id="get_user_balance",
    tags=["balances"],
    responses={
        HTTP_200_OK: {
            "description": "Success",
        },
    },
)
async def get_user_balance(
    db_session: DbSessionDep,
    user_id: TokenDecodedUserIdDep,
    store_id: Annotated[str, Query(example=store_id_example)],
) -> UserBalanceModel:
    balance_service = UserBalanceService(db_session)
    balance = balance_service.get_balance(user_id, store_id)

    return UserBalanceModel(balance=balance.value)


@balance_router.post(
    path="",
    operation_id="change_user_balance",
    tags=["internal"],
    responses={
        HTTP_200_OK: {"description": "Success"},
    },
)
async def change_user_balance(
    db_session: DbSessionDep, balance_change_model: BalanceChangeModel
) -> DetailModel:
    balance_service = UserBalanceService(db_session)
    balance_service.change_balance(
        balance_change_model.user_id,
        balance_change_model.store_id,
        balance_change_model.delta,
    )
    return DetailModel(detail="Success")
