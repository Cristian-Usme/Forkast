import type { AuthChangeEvent, Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export type SignUpPayload = {
  email: string;
  password: string;
  nombre: string;
};

export type SignInPayload = {
  email: string;
  password: string;
};

export async function signUpWithProfile(payload: SignUpPayload) {
  const { data, error } = await supabase.auth.signUp({
    email: payload.email,
    password: payload.password,
    options: {
      data: {
        nombre: payload.nombre,
      },
    },
  });

  if (error) {
    return { data: null, error };
  }

  if (!data.user) {
    return { data, error: null };
  }

  const { error: profileError } = await ensureUserProfile(data.user, payload.nombre);

  if (profileError) {
    return { data: null, error: profileError };
  }

  return { data, error: null };
}

export async function signInWithPassword(payload: SignInPayload) {
  return supabase.auth.signInWithPassword({
    email: payload.email,
    password: payload.password,
  });
}

export async function signOut() {
  return supabase.auth.signOut();
}

export async function getSession() {
  return supabase.auth.getSession();
}

export function onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void) {
  return supabase.auth.onAuthStateChange(callback);
}

export async function ensureUserProfile(user: User, nombre?: string) {
  const fallbackName = nombre || user.user_metadata?.nombre || user.email || 'Usuario';
  return supabase.from('usuario').upsert(
    {
      id_usuario: user.id,
      nombre: fallbackName,
      presupuesto_semanal: null,
      nivel_dificultad: null,
    },
    { onConflict: 'id_usuario', ignoreDuplicates: true }
  );
}
