import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { ensureUserProfile, getSession, onAuthStateChange, signInWithPassword, signOut, signUpWithProfile } from '@/services/auth';

export type AuthContextValue = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (
    email: string,
    password: string,
    nombre: string
  ) => Promise<{ error: Error | null; needsEmailConfirmation: boolean }>;
  signOut: () => Promise<{ error: Error | null }>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    getSession().then(({ data, error }) => {
      if (!isMounted) {
        return;
      }

      if (error) {
        setSession(null);
        setUser(null);
        setLoading(false);
        return;
      }

      setSession(data.session ?? null);
      setUser(data.session?.user ?? null);
      if (data.session?.user) {
        ensureUserProfile(data.session.user).catch((profileError) => {
          console.error('Failed to ensure user profile:', profileError);
        });
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = onAuthStateChange((_event, updatedSession) => {
      if (!isMounted) {
        return;
      }

      setSession(updatedSession);
      setUser(updatedSession?.user ?? null);
      if (updatedSession?.user) {
        ensureUserProfile(updatedSession.user).catch((profileError) => {
          console.error('Failed to ensure user profile:', profileError);
        });
      }
      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleSignIn = useCallback(async (email: string, password: string) => {
    const { error } = await signInWithPassword({ email, password });
    return { error: error ?? null };
  }, []);

  const handleSignUp = useCallback(async (email: string, password: string, nombre: string) => {
    const { data, error } = await signUpWithProfile({ email, password, nombre });
    return {
      error: error ?? null,
      needsEmailConfirmation: Boolean(data && !data.session),
    };
  }, []);

  const handleSignOut = useCallback(async () => {
    const { error } = await signOut();
    return { error: error ?? null };
  }, []);

  const value = useMemo(
    () => ({
      user,
      session,
      loading,
      signIn: handleSignIn,
      signUp: handleSignUp,
      signOut: handleSignOut,
    }),
    [handleSignIn, handleSignUp, handleSignOut, loading, session, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider.');
  }
  return context;
}
