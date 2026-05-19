from fastapi import APIRouter

from app.core.config import settings
from app.core.supabase import get_supabase_client

router = APIRouter()


@router.get('/', tags=['health'])
def root():
    return {
        'message': 'Forkast API is running.',
        'health': '/health',
        'meta': '/meta',
    }


@router.get('/health', tags=['health'])
def health_check():
    return {'status': 'ok'}


@router.get('/meta', tags=['health'])
def meta():
    return {
        'service': settings.app_name,
        'version': settings.app_version,
        'supabase_url': settings.supabase_url,
    }


@router.get('/test-supabase', tags=['health'])
def test_supabase():
    supabase = get_supabase_client()
    try:
        response = supabase.from_('receta_ingrediente').select('*', count='exact', head=True).execute()
        return {
            'ok': True,
            'count': response.count,
            'table': 'receta_ingrediente',
            'error': None,
        }
    except Exception as exc:
        return {
            'ok': False,
            'count': None,
            'error': str(exc),
        }
