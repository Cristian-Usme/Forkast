from pathlib import Path
import jwt
from pydantic_settings import BaseSettings, SettingsConfigDict


ENV_PATH = Path(__file__).resolve().parents[2] / '.env'


class Settings(BaseSettings):
    app_name: str = 'Forkast API'
    app_version: str = '0.1.0'
    supabase_url: str
    supabase_key: str
    cors_origins: str = 'http://localhost:5173,http://127.0.0.1:5173'

    model_config = SettingsConfigDict(env_file=str(ENV_PATH), env_file_encoding='utf-8')


settings = Settings()


def get_supabase_key_role() -> str | None:
    try:
        payload = jwt.decode(settings.supabase_key, options={"verify_signature": False, "verify_aud": False})
        return payload.get('role')
    except Exception:
        return None
