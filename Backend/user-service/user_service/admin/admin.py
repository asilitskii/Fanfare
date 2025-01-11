from .auth import AdminAuth
from user_service.db import engine
from fastapi import FastAPI
from sqladmin import Admin

from user_service.settings import settings


def create_admin(app: FastAPI):
    return Admin(app, engine, authentication_backend=AdminAuth(settings.admin_secret_key))
