from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import api_router
from app.core.config import settings

app = FastAPI(title=settings.app_name, version=settings.app_version)

origins = [origin.strip() for origin in settings.cors_origins.split(',') if origin.strip()]
allow_all_origins = not origins

app.add_middleware(
	CORSMiddleware,
	allow_origins=origins if origins else ['*'],
	allow_credentials=False if allow_all_origins else True,
	allow_methods=['*'],
	allow_headers=['*'],
)

app.include_router(api_router)
