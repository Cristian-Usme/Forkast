from pydantic import BaseModel


class RecipeCostsRequest(BaseModel):
    recipe_ids: list[int]


class RecipeCostItem(BaseModel):
    id_receta: int
    total_cost: float
    incompatible_ingredients: int = 0


class RecipeCostsResponse(BaseModel):
    items: list[RecipeCostItem]
