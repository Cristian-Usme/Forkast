import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import AppLayout from '@/components/layout/AppLayout';
import RecipeCard from '@/components/recommendations/RecipeCard';
import { fetchRecommendations, getCachedRecommendations } from '@/services/recommendations';

const filters = ['Todos', 'Rápido', 'Económico', 'Saludable', 'Popular'];

type RecipeItem = {
  id_receta: number;
  nombre: string;
  descripcion?: string | null;
  duracion?: number | null;
  icon_name: string;
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
        setRecipes(cached.items ?? []);
        setErrorMessage(null);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetchRecommendations();
        if (!isMounted) {
          return;
        }
        setRecipes(response.items ?? []);
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

        <div className="mb-6">
          <div className="flex gap-3 overflow-x-auto pb-2">
            {filters.map(filter => (
              <button
                key={filter}
                className={`px-6 py-3 rounded-full whitespace-nowrap transition-all ${
                  filter === 'Todos'
                    ? 'bg-[color:var(--brand)] text-white shadow-md'
                    : 'bg-white text-[#5A6B5C] hover:bg-[#E8E5DD]'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
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
