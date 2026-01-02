import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Commande } from '@/types';
import { getCommandesByClient } from '@/lib/storage';
import Navbar from '@/components/Navbar';
import OrderCard from '@/components/OrderCard';
import { Button } from '@/components/ui/button';
import { Package, ArrowLeft } from 'lucide-react';

export default function OrderHistoryPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [commandes, setCommandes] = useState<Commande[]>([]);

  useEffect(() => {
    if (currentUser) {
      const userCommandes = getCommandesByClient(currentUser.id);
      setCommandes(userCommandes);
    }
  }, [currentUser]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6 hover:bg-green-50"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour à l'accueil
        </Button>

        <h1 className="text-3xl font-bold text-green-800 mb-8">Mes Commandes</h1>

        {commandes.length === 0 ? (
          <div className="text-center py-16">
            <Package className="h-24 w-24 text-green-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Aucune commande pour le moment
            </h3>
            <p className="text-gray-500 mb-6">
              Commencez vos achats pour voir vos commandes ici
            </p>
            <Button
              onClick={() => navigate('/')}
              className="bg-green-600 hover:bg-green-700"
            >
              Découvrir nos produits
            </Button>
          </div>
        ) : (
          <div className="space-y-4 max-w-3xl mx-auto">
            {commandes.map((commande) => (
              <OrderCard key={commande.id} commande={commande} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}