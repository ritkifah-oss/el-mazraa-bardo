import { Commande } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Package } from 'lucide-react';
import OrderStatusBadge from './OrderStatusBadge';

interface OrderCardProps {
  commande: Commande;
}

export default function OrderCard({ commande }: OrderCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Safely calculate product price with null checks
  const calculateProductPrice = (prixUnitaire: number | null | undefined, quantite: number | null | undefined): string => {
    const prix = Number(prixUnitaire) || 0;
    const qty = Number(quantite) || 0;
    return (prix * qty).toFixed(3);
  };

  // Safely format total with null check
  const formatTotal = (total: number | null | undefined): string => {
    return (Number(total) || 0).toFixed(3);
  };

  return (
    <Card className="border-gray-800 bg-gray-900">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg text-green-400">
              Commande #{commande.id.slice(-8)}
            </CardTitle>
            <div className="flex items-center gap-2 mt-1 text-sm text-gray-400">
              <Calendar className="h-4 w-4" />
              {formatDate(commande.dateCommande)}
            </div>
          </div>
          <OrderStatusBadge statut={commande.statut} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {commande.produits.map((produit, index) => (
            <div key={index} className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-green-400" />
                <span className="text-gray-300">{produit.nomProduit}</span>
                <Badge variant="outline" className="border-green-600 text-green-400 bg-green-950">
                  x{produit.quantite}
                </Badge>
              </div>
              <span className="font-semibold text-green-400">
                {calculateProductPrice(produit.prixUnitaire, produit.quantite)} TND
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-800">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-300">Total</span>
            <span className="text-xl font-bold text-green-400">
              {formatTotal(commande.total)} TND
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}