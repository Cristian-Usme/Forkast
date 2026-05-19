from pydantic import BaseModel


class RecommendedRecipe(BaseModel):
    id_receta: int
    nombre: str
    descripcion: str | None = None
    duracion: int | None = None
    icon_name: str


class RecommendationsResponse(BaseModel):
    recommended_recipe_ids: list[int]
    items: list[RecommendedRecipe]
