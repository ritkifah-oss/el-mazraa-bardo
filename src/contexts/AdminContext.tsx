import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAdminLoggedIn, setAdminSession } from '@/lib/storage';
import { validateAdminCode } from '@/lib/auth';

interface AdminContextType {
  isAdmin: boolean;
  loginAdmin: (code: string) => boolean;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(isAdminLoggedIn());
  }, []);

  const loginAdmin = (code: string): boolean => {
    if (validateAdminCode(code)) {
      const session = {
        isAdmin: true,
        timestamp: Date.now(),
      };
      setAdminSession(session);
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setAdminSession(null);
    setIsAdmin(false);
    // La redirection sera gérée par le composant qui appelle logout
  };

  return (
    <AdminContext.Provider value={{ isAdmin, loginAdmin, logout }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};