from fastapi import APIRouter, Header, HTTPException
import jwt

from app.core.supabase import get_supabase_client
from app.services.recommendation_service import generate_recommendations
from app.schemas.recommendations import RecommendationsResponse

router = APIRouter(prefix='/recommendations', tags=['recommendations'])


def _get_user_id_from_token(authorization: str | None) -> str:
    if not authorization:
        raise HTTPException(status_code=401, detail='Missing Authorization header.')

    if not authorization.lower().startswith('bearer '):
        raise HTTPException(status_code=401, detail='Invalid Authorization header.')

    token = authorization.split(' ', 1)[1].strip()
    supabase = get_supabase_client()
    try:
        user_response = supabase.auth.get_user(token)
        user = user_response.user
        if user:
            return user.id
    except Exception:
        pass

    try:
        payload = jwt.decode(token, options={"verify_signature": False, "verify_aud": False})
        user_id = payload.get('sub') or payload.get('user_id')
        if user_id:
            return user_id
    except Exception:
        pass

    raise HTTPException(status_code=401, detail='Invalid token.')


@router.get('', response_model=RecommendationsResponse)
def get_recommendations(authorization: str | None = Header(default=None)):
    user_id = _get_user_id_from_token(authorization)
    return generate_recommendations(user_id=user_id, top_n=6)
