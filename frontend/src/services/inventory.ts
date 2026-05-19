import { supabase } from '@/lib/supabase';

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000';

export type InventoryItem = {
  id_inventario: number;
  id_ingrediente: number;
  nombre_ingrediente: string | null;
  cantidad_disponible: number;
};

async function getSessionToken(): Promise<string> {
  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData.session?.access_token;

  if (!token) {
    throw new Error('No active session token.');
  }

  return token;
}

export async function fetchInventory(): Promise<InventoryItem[]> {
  const token = await getSessionToken();
  const response = await fetch(`${backendUrl}/inventory`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Failed to fetch inventory.');
  }

  const responseData = await response.json();
  return (responseData.items ?? []) as InventoryItem[];
}

export async function adjustInventory(id_ingrediente: number, cantidad: number): Promise<void> {
  const token = await getSessionToken();
  const response = await fetch(`${backendUrl}/inventory/adjust`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id_ingrediente, cantidad }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Failed to adjust inventory.');
  }
}
