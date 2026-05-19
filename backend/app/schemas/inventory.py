from pydantic import BaseModel


class InventoryItem(BaseModel):
    id_inventario: int
    id_ingrediente: int
    nombre_ingrediente: str | None = None
    cantidad_disponible: float


class InventoryResponse(BaseModel):
    items: list[InventoryItem]


class InventoryAdjustRequest(BaseModel):
    id_ingrediente: int
    cantidad: float
