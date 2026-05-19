from app.core.supabase import get_supabase_client


def _safe_execute(query, default):
    try:
        response = query.execute()
        return getattr(response, 'data', default) or default
    except Exception:
        return default


def fetch_inventory(user_id: str) -> list[dict]:
    supabase = get_supabase_client()
    rows = _safe_execute(
        supabase.from_('inventario_usuario')
        .select('id_inventario,id_ingrediente,cantidad_disponible')
        .eq('id_usuario', user_id),
        []
    )

    ingredient_ids = [row.get('id_ingrediente') for row in rows if row.get('id_ingrediente') is not None]
    ingredient_names = {}
    if ingredient_ids:
        ingredient_rows = _safe_execute(
            supabase.from_('ingrediente')
            .select('id_ingrediente,nombre')
            .in_('id_ingrediente', ingredient_ids),
            []
        )
        ingredient_names = {row.get('id_ingrediente'): row.get('nombre') for row in ingredient_rows}

    items = []
    for row in rows:
        ingredient_id = row.get('id_ingrediente')
        if ingredient_id is None:
            continue
        items.append({
            'id_inventario': row.get('id_inventario'),
            'id_ingrediente': int(ingredient_id),
            'nombre_ingrediente': ingredient_names.get(ingredient_id),
            'cantidad_disponible': float(row.get('cantidad_disponible') or 0),
        })

    return items


def adjust_inventory(user_id: str, ingredient_id: int, quantity_delta: float) -> dict | None:
    supabase = get_supabase_client()

    existing = _safe_execute(
        supabase.from_('inventario_usuario')
        .select('id_inventario,cantidad_disponible')
        .eq('id_usuario', user_id)
        .eq('id_ingrediente', ingredient_id)
        .maybe_single(),
        None
    )

    if existing:
        current_qty = float(existing.get('cantidad_disponible') or 0)
        new_qty = current_qty + quantity_delta
        if new_qty <= 0:
            _safe_execute(
                supabase.from_('inventario_usuario')
                .delete()
                .eq('id_inventario', existing.get('id_inventario')),
                []
            )
            return None

        updated = _safe_execute(
            supabase.from_('inventario_usuario')
            .update({'cantidad_disponible': new_qty})
            .eq('id_inventario', existing.get('id_inventario')),
            []
        )
        if isinstance(updated, list) and updated:
            return updated[0]
        return updated if isinstance(updated, dict) else None

    if quantity_delta <= 0:
        return None

    created = _safe_execute(
        supabase.from_('inventario_usuario')
        .insert({
            'id_usuario': user_id,
            'id_ingrediente': ingredient_id,
            'cantidad_disponible': quantity_delta,
        }),
        []
    )

    if isinstance(created, list) and created:
        return created[0]
    return created if isinstance(created, dict) else None
