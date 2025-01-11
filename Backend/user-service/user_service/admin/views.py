from typing import Any, Coroutine
from fastapi import Request
from user_service.db import UserSchema, SellerRequestsSchema
from sqladmin import ModelView
from datetime import datetime, UTC


class UserIsSellerView(ModelView, model=UserSchema):
    column_list = (  # type: ignore
        UserSchema.seller,
        UserSchema.first_name,
        UserSchema.last_name,
        UserSchema.email,
        UserSchema.birth_date,
        UserSchema.created_at,
        UserSchema.updated_at,
    )
    column_details_list = (  # type: ignore
        UserSchema.seller,
        UserSchema.first_name,
        UserSchema.last_name,
        UserSchema.email,
        UserSchema.birth_date,
        UserSchema.created_at,
        UserSchema.updated_at,
    )
    column_searchable_list = (UserSchema.id,)  # type: ignore
    form_edit_rules = ("seller",)  # type: ignore
    can_create = False
    can_delete = False
    can_export = False

    identity = "users"
    name = "User"
    
    def on_model_change(
        self, data: dict[str, Any], model: UserSchema, is_created: bool, request: Request
    ) -> Coroutine[Any, Any, None]:
        data["updated_at"] = datetime.now(tz=UTC)
        return super().on_model_change(data, model, is_created, request)  # type: ignore


class SellerSchemaView(ModelView, model=SellerRequestsSchema):
    column_list = (  # type: ignore
        SellerRequestsSchema.id,
        SellerRequestsSchema.user,
        SellerRequestsSchema.comment,
        SellerRequestsSchema.status,
        SellerRequestsSchema.created_at,
        SellerRequestsSchema.updated_at,
    )
    column_details_list = (  # type: ignore
        SellerRequestsSchema.id,
        SellerRequestsSchema.user,
        SellerRequestsSchema.comment,
        SellerRequestsSchema.status,
        SellerRequestsSchema.created_at,
        SellerRequestsSchema.updated_at,
    )
    column_searchable_list = (SellerRequestsSchema.user_id,)  # type: ignore
    form_edit_rules = ("status",)  # type: ignore
    can_create = False
    can_delete = False
    can_export = False
    
    identity = "requests"
    name = "Request"

    column_formatters = {  # type: ignore
        SellerRequestsSchema.user: lambda model, _: f"{model.user.first_name} {model.user.last_name}",  # type: ignore
    }
    column_formatters_detail = {  # type: ignore
        SellerRequestsSchema.user: lambda model, _: f"{model.user.first_name} {model.user.last_name}",  # type: ignore
    }

    def on_model_change(
        self, data: dict[str, Any], model: SellerRequestsSchema, is_created: bool, request: Request
    ) -> Coroutine[Any, Any, None]:
        now = datetime.now(tz=UTC)
        data["updated_at"] = now
        if data.get("status", "") == "approved":
            model.user.seller = True
            model.user.updated_at = now
        return super().on_model_change(data, model, is_created, request)  # type: ignore
