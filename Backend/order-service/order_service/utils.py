from order_service.models import (
    OrderInfoModel,
    AddressModel,
    OrderContactInfoModel,
    ProductModel,
    SingleOrderInfoModel,
)
from order_service.db import OrderStatus, OrderSchema


def order_schema_to_model(
    order: OrderSchema, product_limit: int | None = None
) -> OrderInfoModel:
    address_model = AddressModel.model_validate(
        order.delivery_address, from_attributes=True
    )
    contact_info_model = OrderContactInfoModel.model_validate(
        order.contact_info, from_attributes=True
    )
    product_models_list: list[ProductModel] = []
    for product in order.products[:product_limit]:
        product_models_list.append(
            ProductModel(
                id=product.product_id,
                title=product.product_title,
                price=product.product_price,
                logo_url=product.product_logo_url,
                count=product.product_count,
            )
        )

    order_info = OrderInfoModel(
        store_id=order.store_id,
        order_id=order.id,
        total_price=order.total_price,
        status=order.status,
        order_creation_timestamp=order.creation_date,
        order_reception_timestamp=order.reception_date,
        products=product_models_list,
        delivery_address=address_model,
        contact_info=contact_info_model,
    )

    return order_info


def single_order_schema_to_model(
    order: OrderSchema, is_seller: bool, product_limit: int | None = None
) -> SingleOrderInfoModel:
    address_model = AddressModel.model_validate(
        order.delivery_address, from_attributes=True
    )
    contact_info_model = OrderContactInfoModel.model_validate(
        order.contact_info, from_attributes=True
    )
    product_models_list: list[ProductModel] = []
    for product in order.products[:product_limit]:
        product_models_list.append(
            ProductModel(
                id=product.product_id,
                title=product.product_title,
                price=product.product_price,
                logo_url=product.product_logo_url,
                count=product.product_count,
            )
        )

    order_info = SingleOrderInfoModel(
        store_id=order.store_id,
        order_id=order.id,
        total_price=order.total_price,
        status=order.status,
        order_creation_timestamp=order.creation_date,
        order_reception_timestamp=order.reception_date,
        products=product_models_list,
        delivery_address=address_model,
        contact_info=contact_info_model,
        is_seller=is_seller,
    )

    return order_info


def check_new_status(
    old_status: OrderStatus, new_status: OrderStatus, is_seller: bool
) -> bool:
    if is_seller:
        match (old_status, new_status):
            case (
                (OrderStatus.created, OrderStatus.assembly)
                | (OrderStatus.assembly, OrderStatus.on_the_way)
                | (OrderStatus.on_the_way, OrderStatus.awaiting_receipt)
                | (OrderStatus.awaiting_receipt, OrderStatus.received)
            ):
                return True
            case (
                current_old_status,
                OrderStatus.canceled,
            ) if current_old_status not in {OrderStatus.canceled, OrderStatus.received}:
                return True
            case _:
                return False
    else:
        match (old_status, new_status):
            case (
                (OrderStatus.on_the_way, OrderStatus.received)
                | (OrderStatus.awaiting_receipt, OrderStatus.received)
            ):
                return True
            case (
                current_old_status,
                OrderStatus.canceled,
            ) if current_old_status not in {
                OrderStatus.canceled,
                OrderStatus.received,
                OrderStatus.awaiting_receipt,
                OrderStatus.on_the_way,
            }:
                return True
            case _:
                return False
