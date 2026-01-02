import { Minus, Plus, Trash2, ImageOff } from 'lucide-react';
import { CartItem as CartItemType } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { useState } from 'react';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();
  const [imageError, setImageError] = useState(false);

  const handleDecrease = () => {
    if (item.quantite > 1) {
      updateQuantity(item.produit.id, item.quantite - 1);
    }
  };

  const handleIncrease = () => {
    if (item.quantite < item.produit.stock) {
      updateQuantity(item.produit.id, item.quantite + 1);
    }
  };

  const subtotal = item.produit.prix * item.quantite;

  return (
    <Card className="border-green-100">
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Image */}
          <div className="w-24 h-24 bg-green-50 rounded-lg overflow-hidden flex-shrink-0">
            {item.produit.photos && item.produit.photos.length > 0 && !imageError ? (
              <img
                src={item.produit.photos[0]}
                alt={item.produit.nom}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImageOff className="h-8 w-8 text-green-300" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1">
            <h3 className="font-semibold text-green-800 mb-1">{item.produit.nom}</h3>
            <p className="text-sm text-gray-600 mb-2">
              {item.produit.prix.toFixed(2)} DT / unité
            </p>

            {/* Quantité */}
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="outline"
                onClick={handleDecrease}
                className="h-8 w-8 border-green-300 hover:bg-green-50"
              >
                <Minus className="h-4 w-4 text-green-700" />
              </Button>
              <span className="w-12 text-center font-semibold text-green-700">
                {item.quantite}
              </span>
              <Button
                size="icon"
                variant="outline"
                onClick={handleIncrease}
                disabled={item.quantite >= item.produit.stock}
                className="h-8 w-8 border-green-300 hover:bg-green-50"
              >
                <Plus className="h-4 w-4 text-green-700" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => removeFromCart(item.produit.id)}
                className="h-8 w-8 ml-2 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 text-red-600" />
              </Button>
            </div>

            {item.quantite >= item.produit.stock && (
              <p className="text-xs text-orange-600 mt-1">
                Stock maximum atteint
              </p>
            )}
          </div>

          {/* Sous-total */}
          <div className="text-right">
            <p className="text-lg font-bold text-green-600">
              {subtotal.toFixed(2)} DT
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}