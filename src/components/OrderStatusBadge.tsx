import { Badge } from '@/components/ui/badge';
import { OrderStatus } from '@/types';

interface OrderStatusBadgeProps {
  statut: OrderStatus;
}

export default function OrderStatusBadge({ statut }: OrderStatusBadgeProps) {
  const getStatusColor = () => {
    switch (statut) {
      case 'nouvelle':
        return 'bg-blue-900 text-blue-300 border-blue-700 hover:bg-blue-800';
      case 'en préparation':
        return 'bg-orange-900 text-orange-300 border-orange-700 hover:bg-orange-800';
      case 'prête à emporter':
        return 'bg-green-900 text-green-300 border-green-700 hover:bg-green-800';
      case 'livrée':
        return 'bg-purple-900 text-purple-300 border-purple-700 hover:bg-purple-800';
      case 'annulée':
        return 'bg-red-900 text-red-300 border-red-700 hover:bg-red-800';
      default:
        return 'bg-gray-900 text-gray-300 border-gray-700 hover:bg-gray-800';
    }
  };

  const getStatusLabel = () => {
    switch (statut) {
      case 'nouvelle':
        return 'Nouvelle';
      case 'en préparation':
        return 'En préparation';
      case 'prête à emporter':
        return 'Prête à emporter';
      case 'livrée':
        return 'Livrée';
      case 'annulée':
        return 'Annulée';
      default:
        return statut || 'Statut inconnu';
    }
  };

  return (
    <Badge variant="outline" className={`${getStatusColor()} font-semibold transition-colors`}>
      {getStatusLabel()}
    </Badge>
  );
}