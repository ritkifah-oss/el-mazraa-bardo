import { useState, useEffect } from 'react';
import { Produit } from '@/types';
import { getProduits, addProduit, updateProduit, deleteProduit } from '@/lib/storage';
import AdminSidebar from '@/components/AdminSidebar';
import ProductForm from '@/components/ProductForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, ImageOff } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminProducts() {
  const [produits, setProduits] = useState<Produit[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduit, setEditingProduit] = useState<Produit | undefined>();
  const [deletingProduit, setDeletingProduit] = useState<Produit | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadProduits();
  }, []);

  const loadProduits = () => {
    setProduits(getProduits());
  };

  const handleAddProduct = () => {
    setEditingProduit(undefined);
    setIsDialogOpen(true);
  };

  const handleEditProduct = (produit: Produit) => {
    setEditingProduit(produit);
    setIsDialogOpen(true);
  };

  const handleSubmit = (data: Partial<Produit>) => {
    if (editingProduit) {
      updateProduit(editingProduit.id, data);
      toast.success('Produit mis à jour avec succès');
    } else {
      const newProduit: Produit = {
        id: `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        nom: data.nom!,
        photos: data.photos || [],
        prix: data.prix!,
        stock: data.stock!,
        description: data.description!,
        categorie: data.categorie!,
        actif: true,
        dateAjout: new Date().toISOString(),
      };
      addProduit(newProduit);
      toast.success('Produit ajouté avec succès');
    }
    setIsDialogOpen(false);
    loadProduits();
  };

  const handleToggleActive = (produit: Produit) => {
    updateProduit(produit.id, { actif: !produit.actif });
    toast.success(produit.actif ? 'Produit désactivé' : 'Produit activé');
    loadProduits();
  };

  const handleUpdateStock = (produit: Produit, newStock: number) => {
    if (newStock < 0) return;
    updateProduit(produit.id, { stock: newStock });
    toast.success('Stock mis à jour');
    loadProduits();
  };

  const handleDeleteProduct = () => {
    if (deletingProduit) {
      deleteProduit(deletingProduit.id);
      toast.success('Produit supprimé');
      setDeletingProduit(null);
      loadProduits();
    }
  };

  return (
    <div className="flex min-h-screen bg-black">
      <AdminSidebar />
      
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-green-400 mb-2">Gestion des Produits</h1>
            <p className="text-gray-400">{produits.length} produit(s) au total</p>
          </div>
          <Button
            onClick={handleAddProduct}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg shadow-green-900/50"
          >
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un produit
          </Button>
        </div>

        {produits.length === 0 ? (
          <Card className="border-gray-800 bg-gray-900 shadow-lg">
            <CardContent className="py-16 text-center">
              <p className="text-gray-500 mb-4">Aucun produit pour le moment</p>
              <Button
                onClick={handleAddProduct}
                className="bg-green-600 hover:bg-green-700"
              >
                Ajouter votre premier produit
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {produits.map((produit) => (
              <Card key={produit.id} className="border-gray-800 bg-gradient-to-br from-gray-900 to-gray-800 shadow-lg hover:shadow-green-900/50 transition-shadow">
                <CardHeader className="pb-3 bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg text-green-400 line-clamp-1">
                      {produit.nom}
                    </CardTitle>
                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleToggleActive(produit)}
                        className="h-8 w-8 hover:bg-gray-700"
                      >
                        {produit.actif ? (
                          <ToggleRight className="h-5 w-5 text-green-500" />
                        ) : (
                          <ToggleLeft className="h-5 w-5 text-gray-500" />
                        )}
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleEditProduct(produit)}
                        className="h-8 w-8 hover:bg-blue-900"
                      >
                        <Edit className="h-4 w-4 text-blue-400" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setDeletingProduit(produit)}
                        className="h-8 w-8 hover:bg-red-900"
                      >
                        <Trash2 className="h-4 w-4 text-red-400" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="aspect-square bg-gray-800 rounded-lg mb-3 overflow-hidden border border-gray-700">
                    {produit.photos && produit.photos.length > 0 && !imageErrors[produit.id] ? (
                      <img
                        src={produit.photos[0]}
                        alt={produit.nom}
                        className="w-full h-full object-cover"
                        onError={() => setImageErrors({ ...imageErrors, [produit.id]: true })}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageOff className="h-12 w-12 text-gray-600" />
                      </div>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-400 mb-2 line-clamp-2">
                    {produit.description}
                  </p>

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xl font-bold text-green-500">
                      {produit.prix.toFixed(3)} TND
                    </span>
                    <Badge
                      variant={produit.stock > 0 ? 'outline' : 'destructive'}
                      className={produit.stock > 0 ? 'border-green-600 text-green-400 bg-green-950' : ''}
                    >
                      Stock: {produit.stock}
                    </Badge>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUpdateStock(produit, produit.stock - 1)}
                      disabled={produit.stock === 0}
                      className="flex-1 border-gray-700 bg-gray-800 hover:bg-gray-700 text-gray-300"
                    >
                      -1
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUpdateStock(produit, produit.stock + 1)}
                      className="flex-1 border-gray-700 bg-gray-800 hover:bg-gray-700 text-gray-300"
                    >
                      +1
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUpdateStock(produit, produit.stock + 10)}
                      className="flex-1 border-gray-700 bg-gray-800 hover:bg-gray-700 text-gray-300"
                    >
                      +10
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Dialog Formulaire */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-800">
            <DialogHeader>
              <DialogTitle className="text-green-400">
                {editingProduit ? 'Modifier le produit' : 'Ajouter un produit'}
              </DialogTitle>
            </DialogHeader>
            <ProductForm
              produit={editingProduit}
              onSubmit={handleSubmit}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Dialog Suppression */}
        <AlertDialog open={!!deletingProduit} onOpenChange={() => setDeletingProduit(null)}>
          <AlertDialogContent className="bg-gray-900 border-gray-800">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-gray-200">Confirmer la suppression</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-400">
                Êtes-vous sûr de vouloir supprimer le produit "{deletingProduit?.nom}" ?
                Cette action est irréversible.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700">Annuler</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteProduct}
                className="bg-red-600 hover:bg-red-700"
              >
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  );
}