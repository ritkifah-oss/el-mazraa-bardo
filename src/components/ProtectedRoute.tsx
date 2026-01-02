import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/contexts/AdminContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { currentUser } = useAuth();
  const { isAdmin } = useAdmin();

  if (requireAdmin) {
    if (!isAdmin) {
      return <Navigate to="/admin/login" replace />;
    }
  } else {
    if (!currentUser) {
      return <Navigate to="/login" replace />;
    }
  }

  return <>{children}</>;
}