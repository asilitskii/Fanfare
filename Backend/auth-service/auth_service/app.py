import json
import logging
import uuid

import structlog
from fastapi import FastAPI
from starlette.datastructures import URL
from starlette.requests import Request
from structlog import get_logger

from auth_service.service_dependencies import lifespan
from auth_service.logging_utils import (
    token_processor,
    token_type_processor,
    exp_processor,
)
from auth_service.routing import router
from auth_service.settings import settings

structlog.configure(
    processors=[
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.dict_tracebacks,
        structlog.contextvars.merge_contextvars,
        structlog.processors.StackInfoRenderer(),
        structlog.processors.add_log_level,
        token_processor,
        token_type_processor,
        exp_processor,
        structlog.processors.JSONRenderer(),
    ],
    logger_factory=structlog.WriteLoggerFactory(),
    wrapper_class=structlog.make_filtering_bound_logger(logging.DEBUG),
)

app_logger = get_logger()

app = FastAPI(lifespan=lifespan)

app.include_router(router)


@app.middleware("http")
async def log_middleware(request: Request, call_next):
    url: URL = request.url
    structlog.contextvars.clear_contextvars()
    structlog.contextvars.bind_contextvars(
        route=f"{url.path}?{url.query}",
        request=str(uuid.uuid4()),
        method=request.method,
    )

    app_logger.debug("received request")

    result = await call_next(request)

    app_logger.debug("processed request", status_code=result.status_code)

    return result


if settings.dump_openapi_schema:
    with open(settings.openapi_schema_file_name, "w", encoding="utf-8") as f:
        json.dump(app.openapi(), f)
