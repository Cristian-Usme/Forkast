import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import AppLayout from '@/components/layout/AppLayout';
import RecipeCard from '@/components/recommendations/RecipeCard';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { addRecipeToPlan, selectWeeklyPlan } from '@/services/plans';
import { fetchRecipeCosts, fetchRecommendations, getCachedRecommendations } from '@/services/recommendations';

type RecipeItem = {
  id_receta: number;
  nombre: string;
  descripcion?: string | null;
  duracion?: number | null;
  icon_name: string;
  total_cost?: number | null;
};

export default function RecommendationsPage() {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState<RecipeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeItem | null>(null);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedMeal, setSelectedMeal] = useState('Desayuno');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadRecommendations = async () => {
      const cached = getCachedRecommendations();
      if (cached) {
        const cachedItems = cached.items ?? [];
        const pricedItems = await attachCosts(cachedItems);
        setRecipes(pricedItems);
        setErrorMessage(null);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetchRecommendations();
        if (!isMounted) {
          return;
        }
        const items = response.items ?? [];
        const pricedItems = await attachCosts(items);
        setRecipes(pricedItems);
        setErrorMessage(null);
      } catch (error) {
        if (!isMounted) {
          return;
        }
        setErrorMessage('No pudimos cargar tus recomendaciones.');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    const attachCosts = async (items: RecipeItem[]) => {
      if (!items.length) {
        return items;
      }

      try {
        const costs = await fetchRecipeCosts(items.map(item => item.id_receta));
        const costMap = new Map(costs.map(cost => [cost.id_receta, cost.total_cost]));
        return items.map(item => ({
          ...item,
          total_cost: costMap.get(item.id_receta) ?? null,
        }));
      } catch {
        return items;
      }
    };

    loadRecommendations();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleAddToMenuClick = (recipe: RecipeItem) => {
    setSelectedRecipe(recipe);
    setSelectedDate(format(new Date(), 'yyyy-MM-dd'));
    setSelectedMeal('Desayuno');
    setSubmitError(null);
    setIsDialogOpen(true);
  };

  const handleSubmitPlan = async () => {
    if (!selectedRecipe) {
      return;
    }
    if (!selectedDate) {
      setSubmitError('Selecciona una fecha valida.');
      return;
    }

    const today = format(new Date(), 'yyyy-MM-dd');
    if (selectedDate < today) {
      setSubmitError('No se puede guardar en dias pasados.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const plan = await selectWeeklyPlan(selectedDate);
      await addRecipeToPlan(plan.id_plan, selectedRecipe.id_receta, selectedDate, selectedMeal);
      setIsDialogOpen(false);
    } catch (error) {
      setSubmitError('No pudimos guardar la receta en el menu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppLayout showLogout activeNav="home" contentClassName="pb-24">
      <div className="max-w-[1600px] mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl text-[#2C3E2F] mb-2" style={{ fontWeight: 700 }}>Recomendaciones Semanales</h1>
          <p className="text-[#5A6B5C]">Personalizadas para ti</p>
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-[#5A6B5C]">
            Generando recomendaciones personalizadas...
          </div>
        ) : null}

        {errorMessage ? (
          <div className="py-12 text-center text-red-600">{errorMessage}</div>
        ) : null}

        {!isLoading && !errorMessage ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id_receta}
                {...recipe}
                onClick={() => navigate(`/recipe/${recipe.id_receta}`)}
                onAddToMenu={() => handleAddToMenuClick(recipe)}
              />
            ))}
          </div>
        ) : null}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Agregar al menu</DialogTitle>
            <DialogDescription>
              {selectedRecipe ? `Selecciona el dia y tipo de comida para ${selectedRecipe.nombre}.` : 'Selecciona el dia y tipo de comida.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-[#2C3E2F]" style={{ fontWeight: 600 }}>Fecha</label>
              <Input
                type="date"
                value={selectedDate}
                min={format(new Date(), 'yyyy-MM-dd')}
                onChange={(event) => setSelectedDate(event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-[#2C3E2F]" style={{ fontWeight: 600 }}>Tipo de comida</label>
              <Select value={selectedMeal} onValueChange={setSelectedMeal}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Desayuno">Desayuno</SelectItem>
                  <SelectItem value="Almuerzo">Almuerzo</SelectItem>
                  <SelectItem value="Cena">Cena</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {submitError ? (
              <p className="text-sm text-red-600">{submitError}</p>
            ) : null}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              type="button"
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmitPlan}
              type="button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Guardando...' : 'Guardar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
