import yaml
from fastapi import FastAPI

from order_service.lifespan import lifespan
from order_service.routers import order_router, balance_router
from order_service.settings import settings

app = FastAPI(lifespan=lifespan, debug=settings.debug)
app.include_router(order_router)
app.include_router(balance_router)

if app.debug:
    openapi_path = settings.openapi_output_path
    openapi_path.parent.mkdir(parents=True, exist_ok=True)
    with open(openapi_path, "w", encoding="utf-8") as f:
        f.write(yaml.dump(app.openapi()))
