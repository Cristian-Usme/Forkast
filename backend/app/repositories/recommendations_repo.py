from collections import defaultdict

import pandas as pd

from app.core.supabase import get_supabase_client


def _safe_execute(query, default):
    try:
        response = query.execute()
        return getattr(response, 'data', default) or default
    except Exception:
        return default


def _safe_data(response, default):
    if response is None:
        return default
    return getattr(response, 'data', default) or default


def fetch_user_profile(user_id: str) -> dict:
    supabase = get_supabase_client()

    user_data = _safe_execute(
        supabase.from_('usuario').select('id_usuario,nivel_dificultad').eq('id_usuario', user_id).maybe_single(),
        {}
    )

    difficulty_id = user_data.get('nivel_dificultad')
    difficulty_name = None
    if difficulty_id is not None:
        diff_data = _safe_execute(
            supabase.from_('niveles_dificultad').select('id_dificultad,nivel').eq('id_dificultad', difficulty_id).maybe_single(),
            {}
        )
        if diff_data:
            difficulty_name = diff_data.get('nivel')

    alergeno_rows = _safe_execute(
        supabase.from_('usuario_alergeno').select('id_alergeno').eq('id_usuario', user_id),
        []
    )
    alergeno_ids = [row['id_alergeno'] for row in alergeno_rows]
    alergeno_names = []
    if alergeno_ids:
        alergeno_catalog_rows = _safe_execute(
            supabase.from_('alergeno').select('id_alergeno,nombre').in_('id_alergeno', alergeno_ids),
            []
        )
        alergeno_map = {row['id_alergeno']: row['nombre'] for row in alergeno_catalog_rows}
        alergeno_names = [alergeno_map.get(a) for a in alergeno_ids if alergeno_map.get(a)]

    dieta_rows = _safe_execute(
        supabase.from_('usuario_dieta').select('id_dieta').eq('id_usuario', user_id),
        []
    )
    dieta_ids = [row['id_dieta'] for row in dieta_rows]
    dieta_names = []
    if dieta_ids:
        dieta_catalog_rows = _safe_execute(
            supabase.from_('dietas').select('id_dieta,tipo_dieta').in_('id_dieta', dieta_ids),
            []
        )
        dieta_map = {row['id_dieta']: row['tipo_dieta'] for row in dieta_catalog_rows}
        dieta_names = [dieta_map.get(d) for d in dieta_ids if dieta_map.get(d)]

    return {
        'nivel_dificultad': difficulty_name,
        'dietas': dieta_names,
        'alergenos': alergeno_names,
    }


def fetch_recipes_dataset() -> pd.DataFrame:
    supabase = get_supabase_client()

    recetas = _safe_execute(
        supabase.from_('recetas').select('id_receta,id_tipo_cocina,id_dificultad,duracion'),
        []
    )

    tipos_cocina_rows = _safe_execute(
        supabase.from_('tipos_cocina').select('id_tipo_cocina,tipo_cocina'),
        []
    )
    tipos_cocina = {row['id_tipo_cocina']: row['tipo_cocina'] for row in tipos_cocina_rows}

    niveles_rows = _safe_execute(
        supabase.from_('niveles_dificultad').select('id_dificultad,nivel'),
        []
    )
    niveles = {row['id_dificultad']: row['nivel'] for row in niveles_rows}

    dieta_rows = _safe_execute(
        supabase.from_('receta_dieta').select('id_receta,id_dieta'),
        []
    )
    dieta_catalog_rows = _safe_execute(
        supabase.from_('dietas').select('id_dieta,tipo_dieta'),
        []
    )
    dieta_map = {row['id_dieta']: row['tipo_dieta'] for row in dieta_catalog_rows}
    dietas_por_receta = defaultdict(list)
    for row in dieta_rows:
        diet = dieta_map.get(row['id_dieta'])
        if diet:
            dietas_por_receta[row['id_receta']].append(diet)

    receta_ingrediente = _safe_execute(
        supabase.from_('receta_ingrediente').select('id_receta,id_ingrediente'),
        []
    )
    ingrediente_rows = _safe_execute(
        supabase.from_('ingrediente').select('id_ingrediente,nombre'),
        []
    )
    ingrediente_map = {row['id_ingrediente']: row['nombre'] for row in ingrediente_rows}

    ingredientes_por_receta = defaultdict(list)
    for row in receta_ingrediente:
        nombre = ingrediente_map.get(row['id_ingrediente'])
        if nombre:
            ingredientes_por_receta[row['id_receta']].append(nombre)

    alergeno_rows = _safe_execute(
        supabase.from_('alergeno').select('id_alergeno,nombre'),
        []
    )
    alergeno_names = [row['nombre'] for row in alergeno_rows if row.get('nombre')]

    records = []
    for receta in recetas:
        receta_id = receta['id_receta']
        ingredientes = ingredientes_por_receta.get(receta_id, [])
        ingredientes_texto = ' '.join(ingredientes).lower()
        alergenos_detectados = [
            nombre for nombre in alergeno_names
            if nombre.lower() in ingredientes_texto
        ]
        records.append({
            'id_receta': receta_id,
            'tipo_cocina': tipos_cocina.get(receta.get('id_tipo_cocina'), 'General'),
            'tipo_comida': 'General',
            'dieta_compatible': ', '.join(dietas_por_receta.get(receta_id, [])) or 'Ninguno',
            'alergenos_presentes': ', '.join(alergenos_detectados) if alergenos_detectados else 'Ninguno',
            'tiempo_total_min': receta.get('duracion') or 0,
            'nivel_dificultad': niveles.get(receta.get('id_dificultad'), 'Principiante'),
            'ingredientes': ', '.join(ingredientes),
        })

    return pd.DataFrame.from_records(records)
