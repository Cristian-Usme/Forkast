from pydantic import BaseModel


class IngredientItem(BaseModel):
    id_ingrediente: int
    nombre: str
    cantidad: float | None = None
    unidad: str | None = None


class RecipeDetailResponse(BaseModel):
    id_receta: int
    nombre: str
    descripcion: str | None = None
    duracion: int | None = None
    icon_name: str | None = None
    ingredientes: list[IngredientItem]


class RecipeListItem(BaseModel):
    id_receta: int
    nombre: str
    descripcion: str | None = None
    duracion: int | None = None
    icon_name: str | None = None


class RecipeListResponse(BaseModel):
    items: list[RecipeListItem]
