import { useEffect, useState } from 'react';
import { Package } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { fetchInventory, type InventoryItem } from '@/services/inventory';

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadInventory = async () => {
      setIsLoading(true);
      try {
        const data = await fetchInventory();
        if (!isMounted) {
          return;
        }
        setItems(data);
        setErrorMessage(null);
      } catch (error) {
        if (!isMounted) {
          return;
        }
        setErrorMessage('No pudimos cargar el inventario.');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadInventory();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <AppLayout showLogout activeNav="inventory" contentClassName="pb-24">
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl text-[#2C3E2F] mb-2" style={{ fontWeight: 700 }}>Inventario</h1>
            <p className="text-[#5A6B5C]">Gestiona tus alimentos</p>
          </div>
        </div>

        {errorMessage ? (
          <div className="mb-6 text-center text-red-600">{errorMessage}</div>
        ) : null}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {isLoading ? (
            <div className="col-span-full text-center text-[#5A6B5C] py-8">Cargando inventario...</div>
          ) : null}
          {!isLoading && !items.length ? (
            <div className="col-span-full text-center text-[#5A6B5C] py-8">No hay productos en inventario.</div>
          ) : null}
          {!isLoading && items.length ? items.map(item => (
            <div key={item.id_inventario} className="bg-white rounded-[24px] p-5 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ease-in-out">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-[#2C3E2F] text-lg mb-1" style={{ fontWeight: 600 }}>
                    {item.nombre_ingrediente ?? 'Ingrediente'}
                  </h3>
                  <p className="text-[#5A6B5C]">Cantidad: {item.cantidad_disponible}</p>
                </div>
                <div className="bg-[color:var(--brand-soft)] p-2 rounded-full">
                  <Package size={16} className="text-[color:var(--brand)]" />
                </div>
              </div>
            </div>
          )) : null}
        </div>
      </div>
    </AppLayout>
  );
}