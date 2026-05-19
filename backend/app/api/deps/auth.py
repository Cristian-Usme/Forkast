from fastapi import HTTPException
import jwt

from app.core.supabase import get_supabase_client


def get_user_id_from_token(authorization: str | None) -> str:
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
