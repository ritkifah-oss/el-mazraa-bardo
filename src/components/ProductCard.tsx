import { useState } from 'react';
import { ShoppingCart, ImageOff } from 'lucide-react';
import { Produit } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

interface ProductCardProps {
  produit: Produit;
  onClick?: () => void;
}

export default function ProductCard({ produit, onClick }: ProductCardProps) {
  const { addToCart } = useCart();
  const [imageError, setImageError] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!produit.actif) {
      toast.error('Ce produit n\'est plus disponible');
      return;
    }
    
    if (produit.stock <= 0) {
      toast.error('Produit en rupture de stock');
      return;
    }

    const success = addToCart(produit, 1);
    if (success) {
      toast.success('Produit ajouté au panier');
    } else {
      toast.error('Impossible d\'ajouter ce produit');
    }
  };

  const isAvailable = produit.actif && produit.stock > 0;

  return (
    <Card 
      className="cursor-pointer hover:shadow-2xl hover:shadow-green-900/50 transition-all duration-300 border-gray-800 bg-gray-900 overflow-hidden group"
      onClick={onClick}
    >
      <div className="relative h-48 bg-gray-800 overflow-hidden">
        {produit.photos && produit.photos.length > 0 && !imageError ? (
          <img
            src={produit.photos[0]}
            alt={produit.nom}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageOff className="h-16 w-16 text-gray-600" />
          </div>
        )}
        {!isAvailable && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
            <Badge variant="destructive" className="text-lg">
              {produit.stock <= 0 ? 'Rupture de stock' : 'Indisponible'}
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg text-green-400 mb-1 line-clamp-1">
          {produit.nom}
        </h3>
        <p className="text-sm text-gray-400 mb-2 line-clamp-2">
          {produit.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-green-500">
            {produit.prix.toFixed(3)} TND
          </span>
          {isAvailable && (
            <Badge variant="outline" className="border-green-600 text-green-400 bg-green-950">
              Stock: {produit.stock}
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          onClick={handleAddToCart}
          disabled={!isAvailable}
          className="w-full bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-700 disabled:text-gray-500"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Ajouter au panier
        </Button>
      </CardFooter>
    </Card>
  );
}