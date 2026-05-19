import type { InventoryItem } from '@/types';

export const inventoryItems: InventoryItem[] = [
  { id: 1, name: 'Aceite de Oliva', quantity: '1 botella', purchased: '15 Abr 2026', expires: '15 Dic 2026', warning: false },
  { id: 2, name: 'Arroz', quantity: '2 lb', purchased: '10 Abr 2026', expires: '10 Oct 2026', warning: false },
  { id: 3, name: 'Pasta', quantity: '3 cajas', purchased: '12 Abr 2026', expires: '12 Ago 2027', warning: false },
  { id: 4, name: 'Tomates Enlatados', quantity: '4 latas', purchased: '1 Abr 2026', expires: '1 Abr 2027', warning: false },
  { id: 5, name: 'Leche', quantity: '1 galón', purchased: '2 May 2026', expires: '9 May 2026', warning: true },
  { id: 6, name: 'Huevos', quantity: '12 unid', purchased: '1 May 2026', expires: '15 May 2026', warning: true },
  { id: 7, name: 'Pan', quantity: '1 pieza', purchased: '3 May 2026', expires: '7 May 2026', warning: true }
];
