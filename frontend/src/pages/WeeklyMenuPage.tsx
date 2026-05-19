import { addDays, format, startOfWeek } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
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
import { addRecipeToPlan, fetchWeeklyPlan, selectWeeklyPlan } from '@/services/plans';
import { fetchAllRecipes, type RecipeListItem } from '@/services/recipes';

const meals = ['Desayuno', 'Almuerzo', 'Cena'];
const dayLabels = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

export default function WeeklyMenuPage() {
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [recipes, setRecipes] = useState<RecipeListItem[]>([]);
  const [planItems, setPlanItems] = useState<Record<string, number>>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedMeal, setSelectedMeal] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const weekDays = useMemo(() => (
    dayLabels.map((label, index) => ({
      label,
      date: addDays(weekStart, index),
    }))
  ), [weekStart]);

  const today = format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setIsLoading(true);
      try {
        const [allRecipes, plan] = await Promise.all([
          fetchAllRecipes(),
          fetchWeeklyPlan(format(weekStart, 'yyyy-MM-dd')).catch(() => null),
        ]);

        if (!isMounted) {
          return;
        }

        setRecipes(allRecipes);

        if (plan?.items) {
          const map: Record<string, number> = {};
          plan.items.forEach((item) => {
            const key = `${item.fecha}|${item.tipo_comida}`;
            map[key] = item.id_receta;
          });
          setPlanItems(map);
        } else {
          setPlanItems({});
        }
        setErrorMessage(null);
      } catch (error) {
        if (!isMounted) {
          return;
        }
        setErrorMessage('No pudimos cargar el menú semanal.');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [weekStart]);

  const recipeMap = useMemo(() => (
    new Map(recipes.map((recipe) => [recipe.id_receta, recipe]))
  ), [recipes]);

  const filteredRecipes = useMemo(() => (
    recipes.filter((recipe) => recipe.nombre.toLowerCase().includes(searchTerm.toLowerCase()))
  ), [recipes, searchTerm]);

  const openAddDialog = (dateValue: string, meal: string) => {
    setSelectedDate(dateValue);
    setSelectedMeal(meal);
    setSearchTerm('');
    setIsDialogOpen(true);
  };

  const handleAddRecipe = async (recipeId: number) => {
    if (!selectedDate || !selectedMeal) {
      return;
    }
    if (selectedDate < today) {
      setErrorMessage('No se puede guardar en dias pasados.');
      return;
    }

    try {
      const plan = await selectWeeklyPlan(selectedDate);
      const updated = await addRecipeToPlan(plan.id_plan, recipeId, selectedDate, selectedMeal);
      const map: Record<string, number> = {};
      updated.items.forEach((item) => {
        const key = `${item.fecha}|${item.tipo_comida}`;
        map[key] = item.id_receta;
      });
      setPlanItems(map);
      setIsDialogOpen(false);
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage('No pudimos guardar la receta en el menú.');
    }
  };

  return (
    <AppLayout showLogout activeNav="menu" contentClassName="pb-24">
      <div className="max-w-[1600px] mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl text-[#2C3E2F] mb-2" style={{ fontWeight: 700 }}>Menú Semanal</h1>
            <p className="text-[#5A6B5C]">Planifica tus comidas</p>
          </div>

          <div className="flex items-center gap-3 bg-white rounded-full p-3 shadow-sm">
            <button
              className="text-[#5A6B5C] hover:text-[color:var(--brand)]"
              onClick={() => setWeekStart(addDays(weekStart, -7))}
              type="button"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-[#2C3E2F] px-4" style={{ fontWeight: 600 }}>
              {format(weekStart, 'MMM d')} – {format(addDays(weekStart, 6), 'MMM d')}
            </span>
            <button
              className="text-[#5A6B5C] hover:text-[color:var(--brand)]"
              onClick={() => setWeekStart(addDays(weekStart, 7))}
              type="button"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {errorMessage ? (
          <div className="mb-6 text-center text-red-600">{errorMessage}</div>
        ) : null}

        {/* Desktop View - Table Layout */}
        <div className="hidden md:block bg-white rounded-[32px] p-6 shadow-md overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="p-4 text-left text-[#5A6B5C]"></th>
                {weekDays.map(day => (
                  <th key={day.label} className="p-4 text-center text-[#2C3E2F]" style={{ fontWeight: 600 }}>
                    <div className="flex flex-col items-center">
                      <span>{day.label}</span>
                      <span className="text-xs text-[#5A6B5C]">{format(day.date, 'dd/MM')}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {meals.map(meal => (
                <tr key={meal} className="border-t border-[#F5F3ED]">
                  <td className="p-4 text-[#2C3E2F]" style={{ fontWeight: 600 }}>{meal}</td>
                  {weekDays.map(day => {
                    const dayValue = format(day.date, 'yyyy-MM-dd');
                    const key = `${dayValue}|${meal}`;
                    const recipeId = planItems[key];
                    const recipe = recipeId ? recipeMap.get(recipeId) : null;
                    const isPast = dayValue < today;
                    return (
                      <td key={`${day.label}-${meal}`} className="p-2">
                        {recipe ? (
                          <div className="min-h-[140px] bg-gradient-to-br from-[color:var(--brand-soft)] to-[#F5F3ED] rounded-[20px] p-4 flex flex-col items-center justify-center text-center">
                            <div className="text-4xl mb-2 text-[color:var(--brand)]">
                              {recipe.icon_name ? recipe.icon_name[0].toUpperCase() : 'R'}
                            </div>
                            <p className="text-[#2C3E2F] text-sm" style={{ fontWeight: 600 }}>
                              {recipe.nombre}
                            </p>
                          </div>
                        ) : (
                          <button
                            onClick={() => openAddDialog(dayValue, meal)}
                            className="w-full min-h-[140px] bg-[#F5F3ED] hover:bg-[#E8E5DD] rounded-[20px] flex flex-col items-center justify-center transition-all duration-300 ease-in-out"
                            disabled={isPast || isLoading}
                            type="button"
                          >
                            <Plus size={24} className="text-[color:var(--brand)] mb-1" />
                            <span className="text-[#5A6B5C] text-xs">Añadir</span>
                          </button>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View - Card Layout */}
        <div className="md:hidden space-y-4">
          {weekDays.map(day => (
            <div key={day.label} className="bg-white rounded-[24px] p-5 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ease-in-out">
              <h3 className="text-[#2C3E2F] mb-4 text-lg" style={{ fontWeight: 600 }}>
                {day.label} · {format(day.date, 'dd/MM')}
              </h3>

              <div className="space-y-3">
                {meals.map(meal => {
                  const dayValue = format(day.date, 'yyyy-MM-dd');
                  const key = `${dayValue}|${meal}`;
                  const recipeId = planItems[key];
                  const recipe = recipeId ? recipeMap.get(recipeId) : null;
                  const isPast = dayValue < today;

                  return (
                    <div key={meal} className="flex items-center justify-between">
                      <span className="text-[#5A6B5C]">{meal}</span>
                      {recipe ? (
                        <div className="flex items-center gap-2 bg-[#F5F3ED] px-4 py-2 rounded-full">
                          <span className="text-[color:var(--brand)]">
                            {recipe.icon_name ? recipe.icon_name[0].toUpperCase() : 'R'}
                          </span>
                          <span className="text-[#2C3E2F]">{recipe.nombre}</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => openAddDialog(dayValue, meal)}
                          className="flex items-center gap-1 text-[color:var(--brand)]"
                          disabled={isPast || isLoading}
                          type="button"
                        >
                          <Plus size={18} />
                          <span>Añadir</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle>Agregar receta</DialogTitle>
              <DialogDescription>
                Selecciona una receta para {selectedMeal} el {selectedDate}.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <Input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Buscar receta"
              />

              <div className="max-h-72 overflow-y-auto space-y-2">
                {filteredRecipes.length ? (
                  filteredRecipes.map((recipe) => (
                    <div key={recipe.id_receta} className="flex items-center justify-between rounded-xl border border-[#F5F3ED] p-3">
                      <div>
                        <p className="text-[#2C3E2F]" style={{ fontWeight: 600 }}>{recipe.nombre}</p>
                        {recipe.descripcion ? (
                          <p className="text-xs text-[#5A6B5C] line-clamp-1">{recipe.descripcion}</p>
                        ) : null}
                      </div>
                      <Button size="sm" onClick={() => handleAddRecipe(recipe.id_receta)} type="button">
                        Agregar
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-[#5A6B5C]">No hay recetas para mostrar.</p>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} type="button">
                Cerrar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
