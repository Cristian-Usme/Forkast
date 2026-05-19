from fastapi import APIRouter, Header

from app.api.deps.auth import get_user_id_from_token
from app.repositories.pricing_repo import fetch_recipe_costs
from app.schemas.pricing import RecipeCostsRequest, RecipeCostsResponse

router = APIRouter(prefix='/recipes', tags=['recipes'])


@router.post('/costs', response_model=RecipeCostsResponse)
def get_recipe_costs(payload: RecipeCostsRequest, authorization: str | None = Header(default=None)):
    _ = get_user_id_from_token(authorization)
    totals = fetch_recipe_costs(payload.recipe_ids)

    items = []
    for recipe_id in payload.recipe_ids:
        summary = totals.get(recipe_id)
        if not summary:
            items.append({'id_receta': recipe_id, 'total_cost': 0.0, 'incompatible_ingredients': 0})
            continue
        items.append({
            'id_receta': recipe_id,
            'total_cost': float(summary['total_cost']),
            'incompatible_ingredients': int(summary.get('incompatible_ingredients', 0)),
        })

    return {'items': items}
