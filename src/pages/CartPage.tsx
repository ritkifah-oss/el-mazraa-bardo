import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { addCommande, decrementStock } from '@/lib/storage';
import { Commande, ProduitCommande } from '@/types';
import Navbar from '@/components/Navbar';
import CartItem from '@/components/CartItem';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function CartPage() {
  const navigate = useNavigate();
  const { cart, getTotal, clearCart } = useCart();
  const { currentUser } = useAuth();

  const total = getTotal();

  const handleValidateOrder = () => {
    if (cart.length === 0) {
      toast.error('Votre panier est vide');
      return;
    }

    if (!currentUser) {
      toast.error('Vous devez être connecté pour commander');
      navigate('/login');
      return;
    }

    // Vérifier la disponibilité des produits
    for (const item of cart) {
      if (!item.produit.actif || item.produit.stock < item.quantite) {
        toast.error(`Le produit "${item.produit.nom}" n'est plus disponible en quantité suffisante`);
        return;
      }
    }

    // Créer la commande
    const produits: ProduitCommande[] = cart.map(item => ({
      produitId: item.produit.id,
      quantite: item.quantite,
      prixUnitaire: item.produit.prix,
      nomProduit: item.produit.nom,
    }));

    const commande: Commande = {
      id: `cmd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      clientId: currentUser.id,
      clientNom: currentUser.nom,
      clientPrenom: currentUser.prenom,
      clientTelephone: currentUser.telephone,
      clientEmail: currentUser.email,
      produits,
      total,
      statut: 'nouvelle',
      dateCommande: new Date().toISOString(),
      dateModification: new Date().toISOString(),
    };

    // Décrémenter le stock
    for (const item of cart) {
      decrementStock(item.produit.id, item.quantite);
    }

    // Enregistrer la commande
    addCommande(commande);

    // Vider le panier
    clearCart();

    toast.success('Commande validée avec succès !');
    navigate('/orders');
  };

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6 hover:bg-gray-800 text-gray-300"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Continuer mes achats
        </Button>

        <h1 className="text-3xl font-bold text-green-400 mb-8">Mon Panier</h1>

        {cart.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingCart className="h-24 w-24 text-green-800 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              Votre panier est vide
            </h3>
            <p className="text-gray-500 mb-6">
              Ajoutez des produits pour commencer vos achats
            </p>
            <Button
              onClick={() => navigate('/')}
              className="bg-green-600 hover:bg-green-700"
            >
              Découvrir nos produits
            </Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Liste des articles */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <CartItem key={item.produit.id} item={item} />
              ))}
            </div>

            {/* Résumé */}
            <div>
              <Card className="border-gray-800 bg-gray-900 sticky top-24">
                <CardHeader>
                  <CardTitle className="text-green-400">Résumé de la commande</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-gray-400">
                      <span>Sous-total</span>
                      <span>{total.toFixed(3)} TND</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Livraison</span>
                      <span className="text-green-500">Gratuite</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-800">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-lg font-semibold text-gray-300">Total</span>
                      <span className="text-2xl font-bold text-green-500">
                        {total.toFixed(3)} TND
                      </span>
                    </div>

                    <Button
                      onClick={handleValidateOrder}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg"
                    >
                      Valider la commande
                    </Button>
                  </div>

                  <p className="text-xs text-gray-500 text-center">
                    En validant, vous confirmez votre commande
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}