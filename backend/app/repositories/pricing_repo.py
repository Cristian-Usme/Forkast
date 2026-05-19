from collections import defaultdict

from app.core.supabase import get_supabase_client


def _safe_execute(query, default):
    try:
        response = query.execute()
        return getattr(response, 'data', default) or default
    except Exception:
        return default


def fetch_recipe_costs(recipe_ids: list[int]) -> dict[int, dict]:
    if not recipe_ids:
        return {}

    supabase = get_supabase_client()

    recipe_ingredients = _safe_execute(
        supabase.from_('receta_ingrediente')
        .select('id_receta,id_ingrediente,cantidad,id_unidad')
        .in_('id_receta', recipe_ids),
        []
    )

    ingredient_ids = list({row.get('id_ingrediente') for row in recipe_ingredients if row.get('id_ingrediente') is not None})
    product_rows = []
    if ingredient_ids:
        product_rows = _safe_execute(
            supabase.from_('producto_supermercado')
            .select('id_producto,id_ingrediente,cantidad,precio,id_unidad,nombre_comercial')
            .in_('id_ingrediente', ingredient_ids),
            []
        )

    products_by_ingredient: dict[int, list[dict]] = defaultdict(list)
    for row in product_rows:
        ingredient_id = row.get('id_ingrediente')
        if ingredient_id is not None:
            products_by_ingredient[int(ingredient_id)].append(row)

    totals: dict[int, dict] = {}
    for row in recipe_ingredients:
        recipe_id = row.get('id_receta')
        ingredient_id = row.get('id_ingrediente')
        required_qty = row.get('cantidad')
        unit_id = row.get('id_unidad')
        if recipe_id is None or ingredient_id is None:
            continue

        totals.setdefault(int(recipe_id), {'total_cost': 0.0, 'incompatible_ingredients': 0})

        if required_qty is None:
            totals[int(recipe_id)]['incompatible_ingredients'] += 1
            continue

        candidates = products_by_ingredient.get(int(ingredient_id), [])
        matching = [product for product in candidates if product.get('id_unidad') == unit_id]

        best_product = None
        best_unit_price = None
        for product in matching:
            product_qty = product.get('cantidad')
            product_price = product.get('precio')
            if product_qty is None or product_price is None:
                continue
            product_qty_value = float(product_qty)
            product_price_value = float(product_price)
            if product_qty_value <= 0:
                continue
            unit_price = product_price_value / product_qty_value
            if best_unit_price is None or unit_price < best_unit_price:
                best_unit_price = unit_price
                best_product = product

        if not best_product:
            totals[int(recipe_id)]['incompatible_ingredients'] += 1
            continue

        product_qty_value = float(best_product.get('cantidad'))
        product_price_value = float(best_product.get('precio'))
        required_qty_value = float(required_qty)

        if product_qty_value <= 0:
            totals[int(recipe_id)]['incompatible_ingredients'] += 1
            continue

        cost = (required_qty_value / product_qty_value) * product_price_value
        totals[int(recipe_id)]['total_cost'] += cost

    return totals
