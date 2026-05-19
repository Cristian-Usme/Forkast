from collections import defaultdict
from datetime import date, timedelta
from math import ceil

from app.core.supabase import get_supabase_client


def _safe_execute(query, default):
    try:
        response = query.execute()
        return getattr(response, 'data', default) or default
    except Exception:
        return default


def _start_of_week(target_date: date) -> date:
    return target_date - timedelta(days=target_date.weekday())


def _end_of_week(target_date: date) -> date:
    return _start_of_week(target_date) + timedelta(days=6)


def get_or_create_weekly_plan(user_id: str, target_date: date) -> dict | None:
    supabase = get_supabase_client()
    week_start = _start_of_week(target_date)
    week_end = _end_of_week(target_date)

    existing = _safe_execute(
        supabase.from_('plan_semanal')
        .select('id_plan,fecha_inicio,fecha_fin,id_usuario')
        .eq('id_usuario', user_id)
        .eq('fecha_inicio', str(week_start))
        .eq('fecha_fin', str(week_end))
        .maybe_single(),
        None
    )

    if existing:
        return existing

    created = _safe_execute(
        supabase.from_('plan_semanal')
        .insert({
            'fecha_inicio': str(week_start),
            'fecha_fin': str(week_end),
            'id_usuario': user_id,
        }),
        []
    )

    if isinstance(created, list) and created:
        return created[0]
    return created if isinstance(created, dict) else None


def add_recipe_to_plan(plan_id: int, recipe_id: int, fecha: date, tipo_comida: str) -> dict | None:
    supabase = get_supabase_client()
    payload = {
        'id_plan': plan_id,
        'id_receta': recipe_id,
        'fecha': str(fecha),
        'tipo_comida': tipo_comida,
    }
    result = _safe_execute(
        supabase.from_('plan_receta').upsert(payload),
        []
    )

    if isinstance(result, list) and result:
        return result[0]
    return result if isinstance(result, dict) else None


def fetch_weekly_plan(user_id: str, target_date: date) -> dict | None:
    supabase = get_supabase_client()
    week_start = _start_of_week(target_date)
    week_end = _end_of_week(target_date)

    plan = _safe_execute(
        supabase.from_('plan_semanal')
        .select('id_plan,fecha_inicio,fecha_fin,id_usuario')
        .eq('id_usuario', user_id)
        .eq('fecha_inicio', str(week_start))
        .eq('fecha_fin', str(week_end))
        .maybe_single(),
        None
    )

    if not plan:
        return None

    items = _safe_execute(
        supabase.from_('plan_receta')
        .select('id_receta,fecha,tipo_comida')
        .eq('id_plan', plan['id_plan']),
        []
    )

    plan['items'] = items
    return plan


def generate_shopping_list(plan_id: int, user_id: str) -> dict | None:
    supabase = get_supabase_client()

    plan_rows = _safe_execute(
        supabase.from_('plan_receta').select('id_receta').eq('id_plan', plan_id),
        []
    )
    recipe_ids = [row.get('id_receta') for row in plan_rows if row.get('id_receta') is not None]
    if not recipe_ids:
        return None

    recipe_ingredients = _safe_execute(
        supabase.from_('receta_ingrediente')
        .select('id_receta,id_ingrediente,cantidad,id_unidad')
        .in_('id_receta', recipe_ids),
        []
    )

    required_by_ingredient: dict[int, float] = defaultdict(float)
    for row in recipe_ingredients:
        ingredient_id = row.get('id_ingrediente')
        quantity = row.get('cantidad')
        if ingredient_id is None or quantity is None:
            continue
        required_by_ingredient[int(ingredient_id)] += float(quantity)

    ingredient_ids = list(required_by_ingredient.keys())
    if not ingredient_ids:
        return None

    inventory_rows = _safe_execute(
        supabase.from_('inventario_usuario')
        .select('id_ingrediente,cantidad_disponible')
        .eq('id_usuario', user_id)
        .in_('id_ingrediente', ingredient_ids),
        []
    )
    inventory_map = {row.get('id_ingrediente'): float(row.get('cantidad_disponible') or 0) for row in inventory_rows}

    product_rows = _safe_execute(
        supabase.from_('producto_supermercado')
        .select('id_producto,id_ingrediente,cantidad,precio,id_unidad,nombre_comercial')
        .in_('id_ingrediente', ingredient_ids),
        []
    )

    ingredient_rows = _safe_execute(
        supabase.from_('ingrediente')
        .select('id_ingrediente,nombre')
        .in_('id_ingrediente', ingredient_ids),
        []
    )
    ingredient_names = {row.get('id_ingrediente'): row.get('nombre') for row in ingredient_rows}

    unit_ids = list({row.get('id_unidad') for row in product_rows if row.get('id_unidad') is not None})
    unit_rows = []
    if unit_ids:
        unit_rows = _safe_execute(
            supabase.from_('unidad_medida')
            .select('id_unidad,unidad')
            .in_('id_unidad', unit_ids),
            []
        )
    unit_names = {row.get('id_unidad'): row.get('unidad') for row in unit_rows}

    product_by_ingredient: dict[int, dict] = {}
    for product in product_rows:
        ingredient_id = product.get('id_ingrediente')
        if ingredient_id is None:
            continue
        if int(ingredient_id) not in product_by_ingredient:
            product_by_ingredient[int(ingredient_id)] = product

    items = []
    total_estimado = 0.0
    total_pendiente = 0.0
    for ingredient_id, required_qty in required_by_ingredient.items():
        available_qty = inventory_map.get(ingredient_id, 0.0)
        remaining_qty = max(required_qty - available_qty, 0.0)
        product = product_by_ingredient.get(ingredient_id)
        if not product:
            continue

        product_qty = float(product.get('cantidad')) if product.get('cantidad') is not None else None
        product_price = float(product.get('precio')) if product.get('precio') is not None else None

        if product_qty is not None and product_qty > 0:
            unidades_totales = int(ceil(required_qty / product_qty))
            if product_price is not None:
                total_estimado += unidades_totales * product_price
        elif product_price is not None:
            total_estimado += product_price

        if remaining_qty > 0:
            unidades_necesarias = None
            subtotal = None
            if product_qty is not None and product_qty > 0:
                unidades_necesarias = int(ceil(remaining_qty / product_qty))
                if product_price is not None:
                    subtotal = unidades_necesarias * product_price
                    total_pendiente += subtotal
            elif product_price is not None:
                subtotal = product_price
                total_pendiente += subtotal

            items.append({
                'id_producto': int(product.get('id_producto')),
                'id_ingrediente': ingredient_id,
                'nombre_ingrediente': ingredient_names.get(ingredient_id),
                'nombre_comercial': product.get('nombre_comercial'),
                'cantidad_total': remaining_qty,
                'unidad': unit_names.get(product.get('id_unidad')),
                'cantidad_producto': product_qty,
                'unidades_necesarias': unidades_necesarias,
                'precio_unitario': product_price,
                'subtotal': subtotal,
                'id_unidad': product.get('id_unidad'),
            })

    lista = _safe_execute(
        supabase.from_('lista_compra')
        .select('id_lista,id_plan')
        .eq('id_plan', plan_id)
        .maybe_single(),
        None
    )

    if not lista:
        lista_rows = _safe_execute(
            supabase.from_('lista_compra')
            .insert({
                'id_plan': plan_id,
                'fecha_generacion': str(date.today()),
            }),
            []
        )
        if isinstance(lista_rows, list) and lista_rows:
            lista = lista_rows[0]

    if not lista:
        return None

    for item in items:
        _safe_execute(
            supabase.from_('lista_producto')
            .upsert({
                'id_lista': lista['id_lista'],
                'id_producto': item['id_producto'],
                'cantidad_total': item['cantidad_total'],
            }),
            []
        )

    budget_row = _safe_execute(
        supabase.from_('usuario')
        .select('presupuesto_semanal')
        .eq('id_usuario', user_id)
        .maybe_single(),
        {}
    )
    presupuesto = None
    if budget_row and budget_row.get('presupuesto_semanal') is not None:
        presupuesto = float(budget_row.get('presupuesto_semanal'))

    total_gastado = max(total_estimado - total_pendiente, 0.0)

    return {
        'id_lista': lista['id_lista'],
        'id_plan': plan_id,
        'presupuesto_semanal': presupuesto,
        'total_estimado': total_estimado,
        'total_pendiente': total_pendiente,
        'total_gastado': total_gastado,
        'items': items,
    }
