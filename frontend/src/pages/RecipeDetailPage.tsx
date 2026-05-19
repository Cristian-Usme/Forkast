import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Clock } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { fetchRecipeDetail } from '@/services/recipes';

export default function RecipeDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [recipeName, setRecipeName] = useState('Receta');
  const [recipeDescription, setRecipeDescription] = useState<string | null>(null);
  const [recipeDuration, setRecipeDuration] = useState<number | null>(null);
  const [recipeIcon, setRecipeIcon] = useState('🥗');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const recipeId = Number(id);
    if (!recipeId) {
      setErrorMessage('Receta no encontrada.');
      setIsLoading(false);
      return;
    }

    const loadRecipe = async () => {
      try {
        const recipe = await fetchRecipeDetail(recipeId);
        if (!isMounted) {
          return;
        }
        setRecipeName(recipe.nombre || 'Receta');
        setRecipeDescription(recipe.descripcion ?? null);
        setRecipeDuration(recipe.duracion ?? null);
        setRecipeIcon(recipe.icon_name ? recipe.icon_name[0].toUpperCase() : '🥗');
        const ingredientLabels = (recipe.ingredientes ?? []).map((item) => {
          const qty = item.cantidad != null ? `${item.cantidad}` : 'Cantidad no disponible';
          const unit = item.unidad ? ` ${item.unidad}` : '';
          return `${qty}${unit} ${item.nombre}`.trim();
        });
        setIngredients(ingredientLabels);
        setErrorMessage(null);
      } catch (error) {
        if (!isMounted) {
          return;
        }
        setErrorMessage('No pudimos cargar la receta.');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadRecipe();

    return () => {
      isMounted = false;
    };
  }, [id]);

  return (
    <AppLayout showLogout>
      <div className="max-w-6xl mx-auto">
        <div className="relative">
          <div className="w-full h-80 md:h-96 bg-gradient-to-br from-[color:var(--brand-soft)] to-[color:var(--brand-soft-2)] flex items-center justify-center text-9xl">
            {recipeIcon}
          </div>
          <button
            onClick={() => navigate('/recommendations')}
            className="absolute top-6 left-6 bg-white/90 hover:bg-white p-3 rounded-full shadow-md transition-colors"
          >
            <ArrowLeft size={24} className="text-[color:var(--brand)]" />
          </button>
        </div>

        <div className="px-6 py-8">
          <h1 className="text-4xl text-[#2C3E2F] mb-3" style={{ fontWeight: 700 }}>{recipeName}</h1>

          {recipeDescription ? (
            <p className="text-[#5A6B5C] mb-6 max-w-3xl">{recipeDescription}</p>
          ) : null}

          <div className="flex flex-wrap gap-4 mb-8">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full">
              <Clock size={20} className="text-[color:var(--brand)]" />
              <span className="text-[#5A6B5C]">{recipeDuration ? `${recipeDuration} min` : 'Sin tiempo'}</span>
            </div>
          </div>

          {isLoading ? (
            <div className="py-12 text-center text-[#5A6B5C]">Cargando ingredientes...</div>
          ) : null}

          {errorMessage ? (
            <div className="py-12 text-center text-red-600">{errorMessage}</div>
          ) : null}

          {!isLoading && !errorMessage ? (
            <div className="bg-white rounded-[28px] p-6 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ease-in-out mb-8">
              <h2 className="text-[#2C3E2F] mb-4 text-xl" style={{ fontWeight: 600 }}>Ingredientes</h2>
              {ingredients.length ? (
                <ul className="space-y-3">
                  {ingredients.map((ingredient, index) => (
                    <li key={index} className="text-[#5A6B5C] flex gap-3">
                      <span className="text-[color:var(--brand)] text-xl">•</span>
                      {ingredient}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[#5A6B5C]">No hay ingredientes registrados.</p>
              )}
            </div>
          ) : null}

          <button
            onClick={() => navigate('/menu')}
            className="w-full md:w-auto md:px-12 bg-[color:var(--brand)] text-white py-4 rounded-full shadow-md hover:bg-[color:var(--brand-dark)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            style={{ fontWeight: 600 }}
          >
            Añadir al menú semanal
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
