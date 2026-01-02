import { useState, useEffect } from 'react';
import { getCommandes, updateCommandeStatus, getProduits } from '@/lib/storage';
import { Commande, Produit } from '@/types';
import AdminSidebar from '@/components/AdminSidebar';
import OrderStatusBadge from '@/components/OrderStatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { notifyOrderStatusChange } from '@/lib/notifications';

export default function AdminOrders() {
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [produits, setProduits] = useState<Produit[]>([]);

  useEffect(() => {
    loadCommandes();
    setProduits(getProduits());
  }, []);

  const loadCommandes = () => {
    const allCommandes = getCommandes();
    setCommandes(allCommandes.sort((a, b) => 
      new Date(b.dateCommande).getTime() - new Date(a.dateCommande).getTime()
    ));
  };

  const handleStatusChange = async (commandeId: string, newStatus: string) => {
    const commande = commandes.find(c => c.id === commandeId);
    if (!commande) return;

    updateCommandeStatus(commandeId, newStatus);
    loadCommandes();

    // Envoyer notification si statut est "prête à emporter" ou "livrée"
    if (newStatus === 'prête à emporter' || newStatus === 'livrée') {
      const orderNumber = commandeId.split('_')[1]?.substring(0, 8) || commandeId.substring(0, 8);
      await notifyOrderStatusChange(orderNumber, newStatus);
    }
  };

  const getProduitNom = (produitId: string): string => {
    const produit = produits.find(p => p.id === produitId);
    return produit?.nom || 'Produit inconnu';
  };

  const getProduitsDetails = (commande: Commande): string => {
    if (!commande.produits || commande.produits.length === 0) {
      return 'Aucun produit';
    }
    return commande.produits
      .map(p => `${getProduitNom(p.produitId)} (x${p.quantite})`)
      .join(', ');
  };

  return (
    <div className="flex min-h-screen bg-black">
      <AdminSidebar />
      
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-400 mb-2">Gestion des Commandes</h1>
          <p className="text-gray-400">Gérez et suivez toutes les commandes</p>
        </div>

        <Card className="border-gray-800 bg-gray-900 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-800">
            <CardTitle className="text-green-400">Toutes les Commandes</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {commandes.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Aucune commande pour le moment
              </p>
            ) : (
              <div className="space-y-4">
                {commandes.map((commande) => (
                  <Card key={commande.id} className="border-gray-700 bg-gray-800">
                    <CardContent className="pt-6">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg text-gray-200">
                              {commande.clientPrenom} {commande.clientNom}
                            </h3>
                            <OrderStatusBadge status={commande.statut} />
                          </div>
                          
                          <div className="space-y-1 text-sm text-gray-400">
                            <p>
                              <span className="text-gray-500">📞</span> {commande.clientTelephone}
                            </p>
                            <p>
                              <span className="text-gray-500">📍</span> {commande.adresseLivraison}
                            </p>
                            <p>
                              <span className="text-gray-500">🛒</span> {getProduitsDetails(commande)}
                            </p>
                            <p className="font-semibold text-green-400">
                              💰 Total: {commande.total.toFixed(3)} TND
                            </p>
                            <p className="text-xs text-gray-500">
                              📅 {new Date(commande.dateCommande).toLocaleString('fr-FR')}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 lg:w-64">
                          <Select
                            value={commande.statut}
                            onValueChange={(value) => handleStatusChange(commande.id, value)}
                          >
                            <SelectTrigger className="bg-gray-900 border-gray-700 text-gray-200">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-900 border-gray-700">
                              <SelectItem value="nouvelle" className="text-gray-200">Nouvelle</SelectItem>
                              <SelectItem value="en préparation" className="text-gray-200">En préparation</SelectItem>
                              <SelectItem value="prête à emporter" className="text-gray-200">Prête à emporter</SelectItem>
                              <SelectItem value="livrée" className="text-gray-200">Livrée</SelectItem>
                              <SelectItem value="annulée" className="text-gray-200">Annulée</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}