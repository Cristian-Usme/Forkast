import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import AppLayout from '@/components/layout/AppLayout';
import RecipeCard from '@/components/recommendations/RecipeCard';
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
              />
            ))}
          </div>
        ) : null}
      </div>
    </AppLayout>
  );
}
