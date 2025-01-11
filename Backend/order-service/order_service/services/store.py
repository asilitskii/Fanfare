from typing import Sequence

import requests
from pydantic import HttpUrl, UUID4

from order_service.models.services.store import (
    ProductModel,
    ProductsResponseModel,
    ListStoreInfosModel,
    StoreIsOwnerByUserIdModel,
)


class StoreService:
    def __init__(self, store_service_url: HttpUrl):
        self._url = store_service_url

    def get_all_products(self, store_id: str) -> list[ProductModel] | None:
        params = {"store_id": store_id}
        response = requests.get(f"{self._url}/products", params=params)
        if response.status_code == 404:
            return None
        response.raise_for_status()
        return ProductsResponseModel.validate_python(response.json())

    def is_user_store_owner(self, store_id: str, user_id: UUID4) -> bool:
        params = {"user_id": str(user_id), "store_id": store_id}
        response = requests.get(f"{self._url}/stores/{store_id}/is-owner-by-user-id", params=params)
        response.raise_for_status()
        return StoreIsOwnerByUserIdModel.model_validate(response.json()).owner

    @staticmethod
    def __make_products_dict(
        products: Sequence[ProductModel] | None
    ) -> dict[str, ProductModel] | None:
        if products is None:
            return None
        return {product.product_id: product for product in products}

    def get_all_products_dict(self, store_id: str) -> dict[str, ProductModel] | None:
        return self.__make_products_dict(self.get_all_products(store_id))

    def get_owned_stores_ids(self, user_id: UUID4) -> set[str]:
        params = {"user_id": str(user_id)}
        response = requests.get(f"{self._url}/stores/by-owner-id", params=params)
        response.raise_for_status()
        stores = ListStoreInfosModel.validate_python(response.json())
        stores = {store.store_id for store in stores}
        return stores
