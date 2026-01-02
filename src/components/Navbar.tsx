import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, LayoutDashboard, Phone } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useAdmin } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const { getItemCount } = useCart();
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();
  const itemCount = getItemCount();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleContact = () => {
    window.location.href = 'tel:+21699003404';
  };

  return (
    <nav className="sticky top-0 z-50 bg-black shadow-lg border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo et Nom */}
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src="/assets/logo.jpeg" 
              alt="El Mazraa Bardo" 
              className="h-12 w-12 object-contain rounded-full border-2 border-green-500"
            />
            <div>
              <h1 className="text-xl font-bold text-green-500">El Mazraa Bardo</h1>
              <p className="text-xs text-green-400 italic">la nature dans votre assiette</p>
            </div>
          </Link>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {/* Bouton Contact */}
            <Button
              onClick={handleContact}
              variant="outline"
              size="sm"
              className="border-green-500 text-green-400 hover:bg-green-950 hover:text-green-300"
            >
              <Phone className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Contact</span>
            </Button>

            {/* Panier */}
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative hover:bg-gray-800">
                <ShoppingCart className="h-5 w-5 text-green-400" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-green-500 text-black text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                    {itemCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Menu Utilisateur */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-gray-800">
                  <User className="h-5 w-5 text-green-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-gray-900 border-gray-700">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-semibold text-green-400">
                    {currentUser?.prenom} {currentUser?.nom}
                  </p>
                  <p className="text-xs text-gray-400">{currentUser?.email}</p>
                </div>
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuItem onClick={() => navigate('/orders')} className="text-gray-200 hover:bg-gray-800 focus:bg-gray-800">
                  Mes commandes
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem onClick={() => navigate('/admin')} className="text-gray-200 hover:bg-gray-800 focus:bg-gray-800">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Administration
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuItem onClick={handleLogout} className="text-red-400 hover:bg-gray-800 focus:bg-gray-800">
                  <LogOut className="mr-2 h-4 w-4" />
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}