import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Produit } from '@/types';
import { getProduitById } from '@/lib/storage';
import { useCart } from '@/contexts/CartContext';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ShoppingCart, Minus, Plus, ImageOff } from 'lucide-react';
import { toast } from 'sonner';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [produit, setProduit] = useState<Produit | null>(null);
  const [quantite, setQuantite] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (id) {
      const p = getProduitById(id);
      if (p) {
        setProduit(p);
      } else {
        toast.error('Produit introuvable');
        navigate('/');
      }
    }
  }, [id, navigate]);

  if (!produit) {
    return null;
  }

  const isAvailable = produit.actif && produit.stock > 0;

  const handleAddToCart = () => {
    if (!isAvailable) {
      toast.error('Ce produit n\'est pas disponible');
      return;
    }

    const success = addToCart(produit, quantite);
    if (success) {
      toast.success(`${quantite} ${quantite > 1 ? 'produits ajoutés' : 'produit ajouté'} au panier`);
      navigate('/cart');
    } else {
      toast.error('Impossible d\'ajouter ce produit');
    }
  };

  const handleDecrease = () => {
    if (quantite > 1) setQuantite(quantite - 1);
  };

  const handleIncrease = () => {
    if (quantite < produit.stock) setQuantite(quantite + 1);
  };

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
          Retour aux produits
        </Button>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Images */}
          <div>
            <Card className="border-green-100 overflow-hidden mb-4">
              <div className="aspect-square bg-green-50 flex items-center justify-center">
                {produit.photos && produit.photos.length > 0 && !imageError ? (
                  <img
                    src={produit.photos[selectedImage]}
                    alt={produit.nom}
                    className="w-full h-full object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <ImageOff className="h-24 w-24 text-green-300" />
                )}
              </div>
            </Card>

            {/* Miniatures */}
            {produit.photos && produit.photos.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {produit.photos.map((photo, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? 'border-green-500' : 'border-green-100'
                    }`}
                  >
                    <img
                      src={photo}
                      alt={`${produit.nom} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Détails */}
          <div>
            <h1 className="text-3xl font-bold text-green-800 mb-4">
              {produit.nom}
            </h1>

            <div className="flex items-center gap-3 mb-6">
              <span className="text-4xl font-bold text-green-600">
                {produit.prix.toFixed(2)} DT
              </span>
              {isAvailable ? (
                <Badge variant="outline" className="border-green-300 text-green-700">
                  En stock: {produit.stock}
                </Badge>
              ) : (
                <Badge variant="destructive">
                  {produit.stock <= 0 ? 'Rupture de stock' : 'Indisponible'}
                </Badge>
              )}
            </div>

            <Card className="border-green-100 mb-6">
              <CardContent className="p-6">
                <h3 className="font-semibold text-green-800 mb-2">Description</h3>
                <p className="text-gray-700">{produit.description}</p>
              </CardContent>
            </Card>

            {isAvailable && (
              <div className="space-y-4">
                {/* Sélecteur de quantité */}
                <div>
                  <label className="block text-sm font-semibold text-green-800 mb-2">
                    Quantité
                  </label>
                  <div className="flex items-center gap-3">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={handleDecrease}
                      disabled={quantite <= 1}
                      className="border-green-300 hover:bg-green-50"
                    >
                      <Minus className="h-4 w-4 text-green-700" />
                    </Button>
                    <span className="text-2xl font-bold text-green-700 w-16 text-center">
                      {quantite}
                    </span>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={handleIncrease}
                      disabled={quantite >= produit.stock}
                      className="border-green-300 hover:bg-green-50"
                    >
                      <Plus className="h-4 w-4 text-green-700" />
                    </Button>
                  </div>
                  {quantite >= produit.stock && (
                    <p className="text-sm text-orange-600 mt-2">
                      Stock maximum atteint
                    </p>
                  )}
                </div>

                {/* Bouton Ajouter au panier */}
                <Button
                  onClick={handleAddToCart}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Ajouter au panier - {(produit.prix * quantite).toFixed(2)} DT
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}