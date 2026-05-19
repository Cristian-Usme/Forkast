import { supabase } from '@/lib/supabase';

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000';

export type WeeklyPlan = {
  id_plan: number;
  fecha_inicio?: string | null;
  fecha_fin?: string | null;
};

export type WeeklyPlanItem = {
  id_receta: number;
  fecha: string;
  tipo_comida: string | null;
};

export type WeeklyPlanResponse = WeeklyPlan & {
  items: WeeklyPlanItem[];
};

async function getSessionToken(): Promise<string> {
  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData.session?.access_token;

  if (!token) {
    throw new Error('No active session token.');
  }

  return token;
}

export async function selectWeeklyPlan(targetDate: string): Promise<WeeklyPlan> {
  const token = await getSessionToken();
  const response = await fetch(`${backendUrl}/weekly-plans`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ target_date: targetDate }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Failed to select weekly plan.');
  }

  return (await response.json()) as WeeklyPlan;
}

export async function addRecipeToPlan(
  planId: number,
  recipeId: number,
  fecha: string,
  tipoComida: string,
): Promise<WeeklyPlanResponse> {
  const token = await getSessionToken();
  const response = await fetch(`${backendUrl}/weekly-plans/${planId}/recipes`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id_receta: recipeId,
      fecha,
      tipo_comida: tipoComida,
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Failed to add recipe to plan.');
  }

  return (await response.json()) as WeeklyPlanResponse;
}

export async function fetchWeeklyPlan(startDate: string): Promise<WeeklyPlanResponse> {
  const token = await getSessionToken();
  const response = await fetch(`${backendUrl}/weekly-plans?start=${startDate}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Failed to fetch weekly plan.');
  }

  return (await response.json()) as WeeklyPlanResponse;
}
