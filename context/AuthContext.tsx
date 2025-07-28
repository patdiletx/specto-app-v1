import React, { createContext, useState, useEffect, useContext } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

// Definimos la forma de nuestro contexto
type AuthContextType = {
  session: Session | null;
  loading: boolean;
};

// Creamos el contexto con un valor inicial
const AuthContext = createContext<AuthContextType>({
  session: null,
  loading: true,
});

// Hook personalizado para usar nuestro contexto fácilmente desde otros componentes
export function useAuth() {
  return useContext(AuthContext);
}

// Creamos el componente Proveedor del contexto
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Intentamos obtener la sesión inicial al cargar la app
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Escuchamos los cambios en el estado de autenticación (login, logout, etc.)
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (_event !== 'INITIAL_SESSION') {
        setLoading(false);
      }
    });

    // Limpiamos el listener cuando el componente se desmonta para evitar fugas de memoria
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const value = {
    session,
    loading,
  };

  // Envolvemos a los componentes hijos con el contexto,
  // pero solo si no estamos en el estado de carga inicial.
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
