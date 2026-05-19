from datetime import date

from fastapi import APIRouter, Header, HTTPException

from app.api.deps.auth import get_user_id_from_token
from app.repositories.plans_repo import (
    add_recipe_to_plan,
    fetch_weekly_plan,
    generate_shopping_list,
    get_or_create_weekly_plan,
)
from app.schemas.plans import (
    PlanRecipeCreateRequest,
    PlanResponse,
    PlanSelectRequest,
    ShoppingListResponse,
    WeeklyPlanResponse,
)

router = APIRouter(prefix='/weekly-plans', tags=['plans'])


@router.post('', response_model=PlanResponse)
def select_weekly_plan(payload: PlanSelectRequest, authorization: str | None = Header(default=None)):
    user_id = get_user_id_from_token(authorization)
    if payload.target_date < date.today():
        raise HTTPException(status_code=400, detail='No se puede guardar en dias pasados.')

    plan = get_or_create_weekly_plan(user_id, payload.target_date)
    if not plan:
        raise HTTPException(status_code=500, detail='No se pudo crear el plan semanal.')
    return {
        'id_plan': plan['id_plan'],
        'fecha_inicio': plan.get('fecha_inicio'),
        'fecha_fin': plan.get('fecha_fin'),
    }


@router.post('/{plan_id}/recipes', response_model=WeeklyPlanResponse)
def add_plan_recipe(
    plan_id: int,
    payload: PlanRecipeCreateRequest,
    authorization: str | None = Header(default=None),
):
    user_id = get_user_id_from_token(authorization)
    if payload.fecha < date.today():
        raise HTTPException(status_code=400, detail='No se puede guardar en dias pasados.')

    added = add_recipe_to_plan(plan_id, payload.id_receta, payload.fecha, payload.tipo_comida)
    if not added:
        raise HTTPException(status_code=500, detail='No se pudo guardar la receta en el plan.')

    plan = fetch_weekly_plan(user_id, payload.fecha)
    if not plan:
        raise HTTPException(status_code=404, detail='Plan semanal no encontrado.')

    return {
        'id_plan': plan['id_plan'],
        'fecha_inicio': plan.get('fecha_inicio'),
        'fecha_fin': plan.get('fecha_fin'),
        'items': plan.get('items', []),
    }


@router.get('', response_model=WeeklyPlanResponse)
def get_weekly_plan(start: date, authorization: str | None = Header(default=None)):
    user_id = get_user_id_from_token(authorization)
    plan = fetch_weekly_plan(user_id, start)
    if not plan:
        raise HTTPException(status_code=404, detail='Plan semanal no encontrado.')

    return {
        'id_plan': plan['id_plan'],
        'fecha_inicio': plan.get('fecha_inicio'),
        'fecha_fin': plan.get('fecha_fin'),
        'items': plan.get('items', []),
    }


@router.post('/{plan_id}/shopping-list', response_model=ShoppingListResponse)
def create_shopping_list(plan_id: int, authorization: str | None = Header(default=None)):
    user_id = get_user_id_from_token(authorization)
    result = generate_shopping_list(plan_id, user_id)
    if not result:
        raise HTTPException(status_code=404, detail='No se pudo generar la lista de compras.')
    return result
