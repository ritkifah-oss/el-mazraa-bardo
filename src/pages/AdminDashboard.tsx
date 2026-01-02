import { useState, useEffect } from 'react';
import { getProduits, getCommandes } from '@/lib/storage';
import { Commande, Produit } from '@/types';
import AdminSidebar from '@/components/AdminSidebar';
import OrderStatusBadge from '@/components/OrderStatusBadge';
import AdminChat from '@/components/AdminChat';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, ShoppingBag, AlertCircle, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const [produits, setProduits] = useState<Produit[]>([]);
  const [commandes, setCommandes] = useState<Commande[]>([]);

  useEffect(() => {
    setProduits(getProduits());
    setCommandes(getCommandes());
  }, []);

  // Helper function to safely calculate total
  const safeTotal = (total: number | null | undefined): number => {
    return Number(total) || 0;
  };

  // Calculer les revenus UNIQUEMENT pour les commandes "prête à emporter" ou "livrée"
  const calculateRevenue = () => {
    return commandes
      .filter(c => c.statut === 'prête à emporter' || c.statut === 'livrée')
      .reduce((sum, c) => sum + safeTotal(c.total), 0);
  };

  const stats = {
    totalProduits: produits.length,
    produitsActifs: produits.filter(p => p.actif).length,
    produitsRupture: produits.filter(p => p.stock === 0).length,
    totalCommandes: commandes.length,
    commandesNouvelles: commandes.filter(c => c.statut === 'nouvelle').length,
    commandesEnCours: commandes.filter(c => c.statut === 'en préparation' || c.statut === 'prête à emporter').length,
    chiffreAffaires: calculateRevenue(),
  };

  const recentCommandes = commandes
    .sort((a, b) => new Date(b.dateCommande).getTime() - new Date(a.dateCommande).getTime())
    .slice(0, 5);

  return (
    <div className="flex min-h-screen bg-black">
      <AdminSidebar />
      
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-400 mb-2">Dashboard</h1>
          <p className="text-gray-400">Vue d'ensemble de votre supérette</p>
        </div>

        {/* Statistiques avec blocs colorés */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Produits Actifs - Vert */}
          <Card className="border-green-800 bg-gradient-to-br from-green-950 to-gray-900 shadow-lg hover:shadow-green-900/50 transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-green-300">
                Produits Actifs
              </CardTitle>
              <div className="p-2 bg-green-900 rounded-lg">
                <Package className="h-5 w-5 text-green-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-400">
                {stats.produitsActifs}
              </div>
              <p className="text-xs text-green-500 mt-1">
                sur {stats.totalProduits} produits
              </p>
            </CardContent>
          </Card>

          {/* Commandes Nouvelles - Bleu */}
          <Card className="border-blue-800 bg-gradient-to-br from-blue-950 to-gray-900 shadow-lg hover:shadow-blue-900/50 transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-blue-300">
                Commandes Nouvelles
              </CardTitle>
              <div className="p-2 bg-blue-900 rounded-lg">
                <ShoppingBag className="h-5 w-5 text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-400">
                {stats.commandesNouvelles}
              </div>
              <p className="text-xs text-blue-500 mt-1">
                {stats.commandesEnCours} en cours
              </p>
            </CardContent>
          </Card>

          {/* Ruptures de Stock - Orange */}
          <Card className="border-orange-800 bg-gradient-to-br from-orange-950 to-gray-900 shadow-lg hover:shadow-orange-900/50 transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-orange-300">
                Ruptures de Stock
              </CardTitle>
              <div className="p-2 bg-orange-900 rounded-lg">
                <AlertCircle className="h-5 w-5 text-orange-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-400">
                {stats.produitsRupture}
              </div>
              <p className="text-xs text-orange-500 mt-1">
                produits à réapprovisionner
              </p>
            </CardContent>
          </Card>

          {/* Revenus - Mauve/Violet */}
          <Card className="border-purple-800 bg-gradient-to-br from-purple-950 to-gray-900 shadow-lg hover:shadow-purple-900/50 transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-purple-300">
                Revenus
              </CardTitle>
              <div className="p-2 bg-purple-900 rounded-lg">
                <TrendingUp className="h-5 w-5 text-purple-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-400">
                {stats.chiffreAffaires.toFixed(3)} TND
              </div>
              <p className="text-xs text-purple-500 mt-1">
                Commandes livrées/prêtes
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Commandes récentes */}
        <Card className="border-gray-800 bg-gray-900 shadow-lg mb-8">
          <CardHeader className="bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-800">
            <CardTitle className="text-green-400">Commandes Récentes</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {recentCommandes.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Aucune commande pour le moment
              </p>
            ) : (
              <div className="space-y-4">
                {recentCommandes.map((commande) => (
                  <div
                    key={commande.id}
                    className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border border-gray-700 hover:shadow-md hover:border-green-800 transition-all"
                  >
                    <div>
                      <p className="font-semibold text-gray-200">
                        {commande.clientPrenom} {commande.clientNom}
                      </p>
                      <p className="text-sm text-gray-400">
                        {commande.produits?.length || 0} produit(s) - {safeTotal(commande.total).toFixed(3)} TND
                      </p>
                    </div>
                    <div className="text-right flex items-center gap-3">
                      <OrderStatusBadge statut={commande.statut} />
                      <p className="text-xs text-gray-500">
                        {new Date(commande.dateCommande).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Chat Admin */}
        <AdminChat />
      </main>
    </div>
  );
}