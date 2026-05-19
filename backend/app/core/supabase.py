from supabase import Client, create_client

from app.core.config import settings

supabase: Client = create_client(settings.supabase_url, settings.supabase_key)


def get_supabase_client() -> Client:
    return supabase
