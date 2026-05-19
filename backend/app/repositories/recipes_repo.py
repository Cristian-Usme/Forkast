from app.core.supabase import get_supabase_client
from app.repositories.recommendations_repo import _pick_icon_name


def _safe_execute(query, default):
    try:
        response = query.execute()
        return getattr(response, 'data', default) or default
    except Exception:
        return default


def fetch_recipe_detail(recipe_id: int) -> dict | None:
    supabase = get_supabase_client()

    receta = _safe_execute(
        supabase.from_('recetas')
        .select('id_receta,nombre,descripcion,duracion')
        .eq('id_receta', recipe_id)
        .maybe_single(),
        None
    )

    if not receta:
        return None

    ingredient_rows = _safe_execute(
        supabase.from_('receta_ingrediente')
        .select('id_ingrediente,cantidad,id_unidad')
        .eq('id_receta', recipe_id),
        []
    )

    ingredient_ids = [row.get('id_ingrediente') for row in ingredient_rows if row.get('id_ingrediente') is not None]
    unit_ids = [row.get('id_unidad') for row in ingredient_rows if row.get('id_unidad') is not None]

    ingredient_names = {}
    if ingredient_ids:
        ingredient_catalog = _safe_execute(
            supabase.from_('ingrediente').select('id_ingrediente,nombre').in_('id_ingrediente', ingredient_ids),
            []
        )
        ingredient_names = {row.get('id_ingrediente'): row.get('nombre') for row in ingredient_catalog}

    unit_names = {}
    if unit_ids:
        unit_catalog = _safe_execute(
            supabase.from_('unidad_medida').select('id_unidad,unidad').in_('id_unidad', unit_ids),
            []
        )
        unit_names = {row.get('id_unidad'): row.get('unidad') for row in unit_catalog}

    ingredientes = []
    for row in ingredient_rows:
        ingredient_id = row.get('id_ingrediente')
        if ingredient_id is None:
            continue
        ingredientes.append({
            'id_ingrediente': int(ingredient_id),
            'nombre': ingredient_names.get(ingredient_id) or 'Ingrediente',
            'cantidad': float(row.get('cantidad')) if row.get('cantidad') is not None else None,
            'unidad': unit_names.get(row.get('id_unidad')),
        })

    nombre = receta.get('nombre') or 'Receta'

    return {
        'id_receta': receta.get('id_receta'),
        'nombre': nombre,
        'descripcion': receta.get('descripcion'),
        'duracion': receta.get('duracion'),
        'icon_name': _pick_icon_name(nombre),
        'ingredientes': ingredientes,
    }


def fetch_recipes_list() -> list[dict]:
    supabase = get_supabase_client()

    rows = _safe_execute(
        supabase.from_('recetas')
        .select('id_receta,nombre,descripcion,duracion'),
        []
    )

    items = []
    for row in rows:
        nombre = row.get('nombre') or 'Receta'
        items.append({
            'id_receta': row.get('id_receta'),
            'nombre': nombre,
            'descripcion': row.get('descripcion'),
            'duracion': row.get('duracion'),
            'icon_name': _pick_icon_name(nombre),
        })

    return items
