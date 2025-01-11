from typing import Sequence
from datetime import datetime, UTC

from sqlmodel import select, and_
from pydantic import UUID4
from fastapi.exceptions import HTTPException
from starlette.status import HTTP_403_FORBIDDEN

from order_service.db import (
    Session,
    OrderSchema,
    OrdersContactInfoSchema,
    OrdersDeliveryAddressSchema,
    OrderStatus,
    OrdersProductsSchema,
)
from order_service.models import (
    OrderContactInfoModel,
    AddressModel,
    OrderCreationProductModel,
    # ProductModel,
)
from order_service.models.services.store import ProductModel
from order_service.utils import check_new_status


class OrderService:
    _order_active_statuses = {
        OrderStatus.assembly,
        OrderStatus.created,
        OrderStatus.on_the_way,
        OrderStatus.awaiting_receipt,
    }
    _order_archived_statuses = {OrderStatus.canceled, OrderStatus.received}

    def __init__(self, session: Session):
        self._session = session

    def create_order(
        self,
        user_id: UUID4,
        total_price: int,
        store_id: str,
        contact_info: OrderContactInfoModel,
        delivery_address: AddressModel,
        products: Sequence[OrderCreationProductModel],
        products_id_info_dict: dict[str, ProductModel],
    ) -> OrderSchema:
        order = OrderSchema(
            user_id=user_id,
            total_price=total_price,
            store_id=store_id,
        )
        self._session.add(order)
        self._session.commit()
        self._session.refresh(order)

        self._create_contact_info(
            order.id,
            contact_info.last_first_name,
            contact_info.phone_number,
        )

        self._create_delivery_address(
            order.id,
            delivery_address.city,
            delivery_address.street,
            delivery_address.house,
            delivery_address.apartment,
            delivery_address.postal_code,
        )

        self._create_order_products(order.id, products, products_id_info_dict)

        self._session.commit()
        self._session.refresh(order)

        return order

    def _create_contact_info(
        self, order_id: UUID4, last_first_name: str, phone_number: str
    ) -> OrdersContactInfoSchema:
        contact_info = OrdersContactInfoSchema(
            order_id=order_id,
            last_first_name=last_first_name,
            phone_number=phone_number,
        )
        self._session.add(contact_info)
        return contact_info

    def _create_delivery_address(
        self,
        order_id: UUID4,
        city: str,
        street: str,
        house: str,
        apartment: str | None,
        postal_code: str,
    ) -> OrdersDeliveryAddressSchema:
        delivery_address = OrdersDeliveryAddressSchema(
            order_id=order_id,
            city=city,
            street=street,
            house=house,
            apartment=apartment,
            postal_code=postal_code,
        )
        self._session.add(delivery_address)
        return delivery_address

    def _create_order_products(
        self,
        order_id: UUID4,
        order_products: Sequence[OrderCreationProductModel],
        products_info: dict[str, ProductModel],
    ):
        product_id_schemas_dict: dict[str, OrdersProductsSchema] = {}
        for product in order_products:
            if product.id not in product_id_schemas_dict:
                product_info = products_info[product.id]
                order_product = OrdersProductsSchema(
                    order_id=order_id,
                    product_id=product.id,
                    product_title=product_info.title,
                    product_price=product_info.price,
                    product_logo_url=product_info.logo_url,
                    product_count=product.count,
                )
                product_id_schemas_dict[product.id] = order_product
            else:
                product_id_schemas_dict[product.id].product_count += product.count

        for product_id in product_id_schemas_dict.keys():
            order_product = product_id_schemas_dict[product_id]
            self._session.add(order_product)

        self._session.commit()

    def get_order_by_id(self, order_id: UUID4) -> OrderSchema | None:
        query = select(OrderSchema).where(OrderSchema.id == order_id)
        return self._session.exec(query).first()

    def update_order_status(
        self, order: OrderSchema, new_status: OrderStatus, is_seller: bool
    ) -> OrderSchema | None:
        if not check_new_status(order.status, new_status, is_seller):
            raise HTTPException(
                status_code=HTTP_403_FORBIDDEN,
                detail="Wrong order status change",
            )
        now = datetime.now(tz=UTC)
        order.update_date = now
        if new_status == OrderStatus.received:
            order.reception_date = now
        order.status = new_status
        self._session.add(order)
        self._session.commit()
        self._session.refresh(order)
        return order

    def update_order(self, order: OrderSchema) -> OrderSchema | None:
        self._session.add(order)
        self._session.commit()
        self._session.refresh(order)
        return order

    def get_active_orders_by_user_id(self, user_id: UUID4) -> Sequence[OrderSchema]:
        query = (
            select(OrderSchema)
            .where(
                and_(
                    OrderSchema.user_id == user_id,
                    OrderSchema.status.in_(self._order_active_statuses),  # type: ignore
                )
            )
            .order_by(OrderSchema.creation_date.desc())  # type: ignore
        )
        return self._session.exec(query).all()

    def get_archived_orders_by_user_id(self, user_id: UUID4) -> Sequence[OrderSchema]:
        query = (
            select(OrderSchema)
            .where(
                and_(
                    OrderSchema.user_id == user_id,
                    OrderSchema.status.in_(self._order_archived_statuses),  # type: ignore
                )
            )
            .order_by(OrderSchema.creation_date.desc())  # type: ignore
        )
        return self._session.exec(query).all()

    def get_active_orders_by_store_ids(
        self, store_ids: set[str]
    ) -> Sequence[OrderSchema]:
        query = (
            select(OrderSchema)
            .where(
                and_(
                    OrderSchema.store_id.in_(store_ids),  # type: ignore
                    OrderSchema.status.in_(self._order_active_statuses),  # type: ignore
                )
            )
            .order_by(OrderSchema.creation_date.desc())  # type: ignore
        )
        return self._session.exec(query).all()

    def get_archived_orders_by_store_ids(
        self, store_ids: set[str]
    ) -> Sequence[OrderSchema]:
        query = (
            select(OrderSchema)
            .where(
                and_(
                    OrderSchema.store_id.in_(store_ids),  # type: ignore
                    OrderSchema.status.in_(self._order_archived_statuses),  # type: ignore
                )
            )
            .order_by(OrderSchema.creation_date.desc())  # type: ignore
        )
        return self._session.exec(query).all()
