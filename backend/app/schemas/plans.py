from datetime import date

from pydantic import BaseModel


class PlanSelectRequest(BaseModel):
    target_date: date


class PlanResponse(BaseModel):
    id_plan: int
    fecha_inicio: date | None = None
    fecha_fin: date | None = None


class PlanRecipeCreateRequest(BaseModel):
    id_receta: int
    fecha: date
    tipo_comida: str


class PlanRecipeItem(BaseModel):
    id_receta: int
    fecha: date
    tipo_comida: str | None = None


class WeeklyPlanResponse(BaseModel):
    id_plan: int
    fecha_inicio: date | None = None
    fecha_fin: date | None = None
    items: list[PlanRecipeItem]


class ShoppingListItem(BaseModel):
    id_producto: int
    id_ingrediente: int | None = None
    nombre_comercial: str | None = None
    cantidad_total: float
    precio: float | None = None
    id_unidad: int | None = None


class ShoppingListResponse(BaseModel):
    id_lista: int
    id_plan: int
    items: list[ShoppingListItem]
