from fastapi import APIRouter, Header, HTTPException

from app.api.deps.auth import get_user_id_from_token
from app.repositories.recipes_repo import fetch_recipe_detail, fetch_recipes_list
from app.schemas.recipes import RecipeDetailResponse, RecipeListResponse

router = APIRouter(prefix='/recipes', tags=['recipes'])


@router.get('', response_model=RecipeListResponse)
def list_recipes(authorization: str | None = Header(default=None)):
    _ = get_user_id_from_token(authorization)
    items = fetch_recipes_list()
    return {'items': items}


@router.get('/{recipe_id}', response_model=RecipeDetailResponse)
def get_recipe_detail(recipe_id: int, authorization: str | None = Header(default=None)):
    _ = get_user_id_from_token(authorization)
    recipe = fetch_recipe_detail(recipe_id)
    if not recipe:
        raise HTTPException(status_code=404, detail='Receta no encontrada.')
    return recipe
