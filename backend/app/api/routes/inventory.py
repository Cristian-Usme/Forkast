from fastapi import APIRouter, Header, HTTPException

from app.api.deps.auth import get_user_id_from_token
from app.repositories.inventory_repo import adjust_inventory, fetch_inventory
from app.schemas.inventory import InventoryAdjustRequest, InventoryResponse

router = APIRouter(prefix='/inventory', tags=['inventory'])


@router.get('', response_model=InventoryResponse)
def get_inventory(authorization: str | None = Header(default=None)):
    user_id = get_user_id_from_token(authorization)
    items = fetch_inventory(user_id)
    return {'items': items}


@router.post('/adjust')
def adjust_inventory_item(
    payload: InventoryAdjustRequest,
    authorization: str | None = Header(default=None),
):
    user_id = get_user_id_from_token(authorization)
    if payload.cantidad == 0:
        raise HTTPException(status_code=400, detail='Cantidad invalida.')

    adjust_inventory(user_id, payload.id_ingrediente, payload.cantidad)
    return {'ok': True}
