import React, { createContext, useContext, useState, useEffect } from 'react';
import { Client } from '@/types';
import { getCurrentUser, setCurrentUser as saveCurrentUser } from '@/lib/storage';
import { loginClient, registerClient, logoutClient } from '@/lib/auth';

interface AuthContextType {
  currentUser: Client | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (nom: string, prenom: string, telephone: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Vérifier automatiquement si un utilisateur est déjà connecté au chargement
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const result = loginClient(email, password);
    if (result.success && result.client) {
      setCurrentUser(result.client);
    }
    return { success: result.success, message: result.message };
  };

  const register = async (
    nom: string,
    prenom: string,
    telephone: string,
    email: string,
    password: string
  ) => {
    const result = registerClient(nom, prenom, telephone, email, password);
    if (result.success && result.client) {
      setCurrentUser(result.client);
    }
    return { success: result.success, message: result.message };
  };

  const logout = () => {
    logoutClient();
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};