import { addDays, format, startOfWeek } from 'date-fns';
import { AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { adjustInventory } from '@/services/inventory';
import { fetchShoppingList, fetchWeeklyPlan, selectWeeklyPlan, type ShoppingListItem } from '@/services/plans';

export default function ShoppingListPage() {
  const [checkedItems, setCheckedItems] = useState<number[]>([]);
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [items, setItems] = useState<ShoppingListItem[]>([]);
  const [budget, setBudget] = useState<number | null>(null);
  const [total, setTotal] = useState(0);
  const [pendingTotal, setPendingTotal] = useState(0);
  const [spentTotal, setSpentTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const toggleItem = async (item: ShoppingListItem) => {
    const ingredientId = item.id_ingrediente;
    if (!ingredientId) {
      setErrorMessage('No pudimos actualizar el inventario para este item.');
      return;
    }

    const qty = item.unidades_necesarias && item.cantidad_producto
      ? item.unidades_necesarias * item.cantidad_producto
      : item.cantidad_total;

    const wasChecked = checkedItems.includes(item.id_producto);
    const nextChecked = wasChecked
      ? checkedItems.filter((id) => id !== item.id_producto)
      : [...checkedItems, item.id_producto];

    setCheckedItems(nextChecked);
    setErrorMessage(null);

    try {
      await adjustInventory(ingredientId, wasChecked ? -qty : qty);
    } catch (error) {
      setCheckedItems(checkedItems);
      setErrorMessage('No pudimos actualizar el inventario.');
    }
  };

  useEffect(() => {
    let isMounted = true;
    const loadShoppingList = async () => {
      setIsLoading(true);
      try {
        const startDate = format(weekStart, 'yyyy-MM-dd');
        let plan = await fetchWeeklyPlan(startDate).catch(() => null);

        if (!plan && startDate >= format(new Date(), 'yyyy-MM-dd')) {
          plan = await selectWeeklyPlan(startDate);
        }

        if (!plan) {
          if (isMounted) {
            setItems([]);
            setBudget(null);
            setTotal(0);
            setErrorMessage(null);
            setInfoMessage('No tenemos lista de compra para esta semana.');
          }
          return;
        }

        const shoppingList = await fetchShoppingList(plan.id_plan);
        if (!isMounted) {
          return;
        }

        if (!shoppingList) {
          setItems([]);
          setBudget(null);
          setTotal(0);
          setErrorMessage(null);
          setInfoMessage('No tenemos lista de compra para esta semana.');
          return;
        }

        setItems(shoppingList.items ?? []);
        setBudget(shoppingList.presupuesto_semanal ?? null);

        const computedTotal = (shoppingList.items ?? []).reduce((sum, item) => {
          if (item.subtotal != null) {
            return sum + item.subtotal;
          }
          if (item.precio_unitario != null && item.unidades_necesarias != null) {
            return sum + item.precio_unitario * item.unidades_necesarias;
          }
          return sum;
        }, 0);

        const totalEstimado = shoppingList.total_estimado ?? computedTotal;
        const totalPendiente = shoppingList.total_pendiente ?? computedTotal;
        const totalGastado = shoppingList.total_gastado ?? Math.max(totalEstimado - totalPendiente, 0);

        setTotal(totalEstimado);
        setPendingTotal(totalPendiente);
        setSpentTotal(totalGastado);
        setErrorMessage(null);
        setInfoMessage(null);
      } catch (error) {
        if (!isMounted) {
          return;
        }
        setErrorMessage('No pudimos cargar la lista de compras.');
        setInfoMessage(null);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadShoppingList();

    return () => {
      isMounted = false;
    };
  }, [weekStart]);

  const weekRangeLabel = useMemo(() => (
    `${format(weekStart, 'MMM d')} – ${format(addDays(weekStart, 6), 'MMM d')}`
  ), [weekStart]);

  const remainingBudget = budget != null ? budget - total : null;
  const isOverBudget = remainingBudget != null && remainingBudget < 0;

  return (
    <AppLayout showLogout activeNav="shopping" contentClassName="pb-32">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl text-[#2C3E2F] mb-2" style={{ fontWeight: 700 }}>Lista de Compras</h1>
            <p className="text-[#5A6B5C]">Todo lo que necesitas esta semana</p>
          </div>

          <div className="hidden md:flex items-center gap-3 bg-white rounded-full p-3 shadow-sm">
            <button
              className="text-[#5A6B5C] hover:text-[color:var(--brand)]"
              onClick={() => setWeekStart(addDays(weekStart, -7))}
              type="button"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-[#2C3E2F] px-4" style={{ fontWeight: 600 }}>{weekRangeLabel}</span>
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
        {!errorMessage && infoMessage ? (
          <div className="mb-6 text-center text-[#5A6B5C]">{infoMessage}</div>
        ) : null}

        <div className="bg-white rounded-[32px] shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ease-in-out overflow-hidden mb-6">
          {isLoading ? (
            <div className="p-8 text-center text-[#5A6B5C]">Cargando lista de compras...</div>
          ) : null}
          {!isLoading && !items.length ? (
            <div className="p-8 text-center text-[#5A6B5C]">No hay ingredientes para esta semana.</div>
          ) : null}
          {!isLoading && items.length ? items.map((item, index) => (
            <div
              key={`${item.id_producto}-${item.id_ingrediente ?? index}`}
              className={`flex items-center justify-between p-5 md:p-6 hover:bg-[#F5F3ED] transition-colors ${
                index !== items.length - 1 ? 'border-b border-[#F5F3ED]' : ''
              }`}
            >
              <div className="flex items-center gap-4 flex-1">
                <input
                  type="checkbox"
                  checked={checkedItems.includes(item.id_producto)}
                  onChange={() => toggleItem(item)}
                  className="w-6 h-6 rounded-full accent-[color:var(--brand)] cursor-pointer"
                />
                <div className="flex-1">
                  <p className={`text-[#2C3E2F] ${checkedItems.includes(item.id_producto) ? 'line-through opacity-50' : ''}`} style={{ fontWeight: 500 }}>
                    {item.nombre_ingrediente ?? item.nombre_comercial ?? 'Ingrediente'}
                  </p>
                  <p className="text-[#5A6B5C] text-sm">
                    {item.unidades_necesarias && item.cantidad_producto
                      ? `${item.unidades_necesarias * item.cantidad_producto} ${item.unidad ?? ''}`
                      : `${item.cantidad_total} ${item.unidad ?? ''}`}
                  </p>
                </div>
              </div>
              <span className={`text-[#2C3E2F] text-lg ${checkedItems.includes(item.id_producto) ? 'opacity-50' : ''}`} style={{ fontWeight: 600 }}>
                ${((item.subtotal != null ? item.subtotal : item.precio_unitario ?? 0)).toFixed(2)}
              </span>
            </div>
          )) : null}
        </div>

        <div className="bg-gradient-to-r from-[color:var(--brand)] to-[color:var(--brand-dark)] rounded-[28px] p-6 md:p-8 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ease-in-out">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-white/80 mb-1">Costo Total Estimado</p>
              <p className="text-white text-4xl" style={{ fontWeight: 700 }}>${total.toFixed(2)}</p>
              <p className="text-white/80 mt-2 text-sm">Pendiente: ${pendingTotal.toFixed(2)}</p>
            </div>
            <div className="text-white/90 text-right">
              <p className="text-sm">Gastado: ${spentTotal.toFixed(2)}</p>
              <p className="text-sm">Presupuesto: {budget != null ? `$${budget.toFixed(2)}` : 'Sin configurar'}</p>
              {remainingBudget != null ? (
                <p className="text-sm">${remainingBudget.toFixed(2)} restante</p>
              ) : null}
            </div>
          </div>
        </div>

        {isOverBudget ? (
          <div className="mt-6 flex items-center gap-2 rounded-2xl bg-[#FFE9E9] px-4 py-3 text-[#8B1C1C]">
            <AlertTriangle size={18} />
            <span>Estas superando tu presupuesto semanal.</span>
          </div>
        ) : null}
      </div>
    </AppLayout>
  );
}
