from fastapi import FastAPI
from user_service.lifespan import lifespan
from user_service.routers.basic import basic_endpoints_router
from user_service.routers.password_reset import password_reset_router
from user_service.routers.social_links import social_links_router
from user_service.routers.seller_status import seller_status_router
from user_service.settings import settings
from user_service.admin import create_admin, SellerSchemaView, UserIsSellerView
import yaml

app = FastAPI(lifespan=lifespan, debug=settings.debug)

app.include_router(basic_endpoints_router)
app.include_router(password_reset_router)
app.include_router(social_links_router)
app.include_router(seller_status_router)

admin = create_admin(app)

admin.add_view(UserIsSellerView)
admin.add_view(SellerSchemaView)

if app.debug:
    openapi_path = settings.openapi_output_path
    openapi_path.parent.mkdir(parents=True, exist_ok=True)
    with open(openapi_path, "w", encoding="utf-8") as f:
        f.write(yaml.dump(app.openapi()))
