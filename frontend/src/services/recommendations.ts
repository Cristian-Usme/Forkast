import { supabase } from '@/lib/supabase';

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000';
const CACHE_KEY = 'forkast.recommendations';
const CACHE_TTL_MS = 5 * 60 * 1000;

export type RecommendedRecipe = {
  id_receta: number;
  nombre: string;
  descripcion?: string | null;
  duracion?: number | null;
  icon_name: string;
};

export type RecommendationsResponse = {
  recommended_recipe_ids: number[];
  items: RecommendedRecipe[];
};

type CachedRecommendations = {
  timestamp: number;
  data: RecommendationsResponse;
};

export function getCachedRecommendations(): RecommendationsResponse | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) {
      return null;
    }
    const cached = JSON.parse(raw) as CachedRecommendations;
    if (Date.now() - cached.timestamp > CACHE_TTL_MS) {
      sessionStorage.removeItem(CACHE_KEY);
      return null;
    }
    return cached.data;
  } catch {
    return null;
  }
}

function setCachedRecommendations(data: RecommendationsResponse) {
  try {
    const payload: CachedRecommendations = { timestamp: Date.now(), data };
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(payload));
  } catch {
    // Ignore cache errors.
  }
}

export async function fetchRecommendations(): Promise<RecommendationsResponse> {
  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData.session?.access_token;

  if (!token) {
    throw new Error('No active session token.');
  }

  const response = await fetch(`${backendUrl}/recommendations`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Failed to fetch recommendations.');
  }

  const responseData = await response.json();
  setCachedRecommendations(responseData as RecommendationsResponse);
  return responseData as RecommendationsResponse;
}
