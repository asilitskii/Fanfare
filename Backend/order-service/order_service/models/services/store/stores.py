from pydantic import BaseModel, TypeAdapter


class StoreIdModel(BaseModel):
    store_id: str


class StoreIsOwnerByUserIdModel(BaseModel):
    owner: bool


ListStoreInfosModel = TypeAdapter(list[StoreIdModel])
