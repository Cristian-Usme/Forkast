import { supabase } from '@/lib/supabase';

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000';

export type RecipeIngredient = {
  id_ingrediente: number;
  nombre: string;
  cantidad: number | null;
  unidad: string | null;
};

export type RecipeDetail = {
  id_receta: number;
  nombre: string;
  descripcion?: string | null;
  duracion?: number | null;
  icon_name?: string | null;
  ingredientes: RecipeIngredient[];
};

export type RecipeListItem = {
  id_receta: number;
  nombre: string;
  descripcion?: string | null;
  duracion?: number | null;
  icon_name?: string | null;
};

async function getSessionToken(): Promise<string> {
  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData.session?.access_token;

  if (!token) {
    throw new Error('No active session token.');
  }

  return token;
}

export async function fetchRecipeDetail(recipeId: number): Promise<RecipeDetail> {
  const token = await getSessionToken();

  const response = await fetch(`${backendUrl}/recipes/${recipeId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Failed to fetch recipe detail.');
  }

  return (await response.json()) as RecipeDetail;
}

export async function fetchAllRecipes(): Promise<RecipeListItem[]> {
  const token = await getSessionToken();

  const response = await fetch(`${backendUrl}/recipes`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Failed to fetch recipes.');
  }

  const responseData = await response.json();
  return (responseData.items ?? []) as RecipeListItem[];
}
