from pathlib import Path
import secrets
import sys

from app.repositories.recommendations_repo import (
    fetch_recipes_dataset,
    fetch_recipes_details,
    fetch_user_profile,
)


def _ensure_recommender_path() -> None:
    root = Path(__file__).resolve().parents[3]
    system_path = root / 'sistema_recomendacion'
    if str(system_path) not in sys.path:
        sys.path.insert(0, str(system_path))


def generate_recommendations(user_id: str, top_n: int = 6) -> dict:
    _ensure_recommender_path()
    from recipes_recommender_system import preparar_recomendador, recomendar

    perfil = fetch_user_profile(user_id)
    df = fetch_recipes_dataset()
    if df.empty:
        return {
            'recommended_recipe_ids': [],
            'items': [],
        }
    df_pre, sim_matrix = preparar_recomendador(df, calcular_sim=False)

    usuario = {
        'dietas': perfil.get('dietas', []),
        'alergenos': perfil.get('alergenos', []),
        'nivel_dificultad': perfil.get('nivel_dificultad') or '',
        'seed': secrets.randbelow(1_000_000),
    }

    recomendaciones = recomendar(usuario, df_pre, sim_matrix, top_n=top_n)
    recipe_ids = [item['id_receta'] for item in recomendaciones]
    details = fetch_recipes_details(recipe_ids)
    details_map = {item['id_receta']: item for item in details}

    ordered_details = [details_map.get(recipe_id) for recipe_id in recipe_ids]
    ordered_details = [item for item in ordered_details if item]

    return {
        'recommended_recipe_ids': recipe_ids,
        'items': ordered_details,
    }
