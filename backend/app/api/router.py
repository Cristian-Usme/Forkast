from fastapi import APIRouter

from app.api.routes.health import router as health_router
from app.api.routes.plans import router as plans_router
from app.api.routes.pricing import router as pricing_router
from app.api.routes.recommendations import router as recommendations_router

api_router = APIRouter()
api_router.include_router(health_router)
api_router.include_router(pricing_router)
api_router.include_router(plans_router)
api_router.include_router(recommendations_router)
