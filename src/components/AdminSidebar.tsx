import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAdmin } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Package, ShoppingCart, LogOut, Tag } from 'lucide-react';

export default function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAdmin();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/products', icon: Package, label: 'Produits' },
    { path: '/admin/orders', icon: ShoppingCart, label: 'Commandes' },
    { path: '/admin/categories', icon: Tag, label: 'Catégories' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-800 min-h-screen p-6">
      <div className="mb-8">
        <Link to="/admin" className="flex items-center space-x-3">
          <img 
            src="https://mgx-backend-cdn.metadl.com/generate/images/285865/2025-12-31/1c74c936-5460-4d3c-9677-881fffbeead7.png" 
            alt="El Mazraa Bardo" 
            className="h-12 w-12 object-contain rounded-full border-2 border-green-500"
          />
          <div>
            <h2 className="text-lg font-bold text-green-400">Admin</h2>
            <p className="text-xs text-green-500">El Mazraa Bardo</p>
          </div>
        </Link>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link key={item.path} to={item.path}>
            <Button
              variant={isActive(item.path) ? 'default' : 'ghost'}
              className={`w-full justify-start ${
                isActive(item.path)
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'hover:bg-gray-800 text-gray-300'
              }`}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.label}
            </Button>
          </Link>
        ))}
      </nav>

      <div className="mt-auto pt-8">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-400 hover:bg-red-950 hover:text-red-300"
          onClick={handleLogout}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Déconnexion
        </Button>
      </div>
    </div>
  );
}