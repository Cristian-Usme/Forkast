import { supabase } from '@/lib/supabase';

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000';

export async function fetchRecommendations() {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

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

  return response.json() as Promise<{ recommended_recipe_ids: number[] }>;
}
