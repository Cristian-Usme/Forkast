from fastapi import APIRouter, Header

from app.api.deps.auth import get_user_id_from_token
from app.services.recommendation_service import generate_recommendations
from app.schemas.recommendations import RecommendationsResponse

router = APIRouter(prefix='/recommendations', tags=['recommendations'])


@router.get('', response_model=RecommendationsResponse)
def get_recommendations(authorization: str | None = Header(default=None)):
    user_id = get_user_id_from_token(authorization)
    return generate_recommendations(user_id=user_id, top_n=6)
