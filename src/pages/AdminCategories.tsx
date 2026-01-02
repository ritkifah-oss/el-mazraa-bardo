import { useState, useEffect } from 'react';
import { getCategories, addCategorie, deleteCategorie } from '@/lib/storage';
import { Categorie } from '@/types';
import AdminSidebar from '@/components/AdminSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Plus, Tag } from 'lucide-react';
import { toast } from 'sonner';
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

export default function AdminCategories() {
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [newCategorieName, setNewCategorieName] = useState('');
  const [categoryToDelete, setCategoryToDelete] = useState<Categorie | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = () => {
    const cats = getCategories();
    setCategories(cats);
  };

  const handleAddCategorie = () => {
    if (!newCategorieName.trim()) {
      toast.error('Veuillez entrer un nom de catégorie');
      return;
    }

    // Vérifier si la catégorie existe déjà
    const exists = categories.some(
      (cat) => cat.nom.toLowerCase() === newCategorieName.trim().toLowerCase()
    );

    if (exists) {
      toast.error('Cette catégorie existe déjà');
      return;
    }

    const newCategorie: Categorie = {
      id: Date.now().toString(),
      nom: newCategorieName.trim().toLowerCase(),
      dateAjout: new Date().toISOString(),
    };

    addCategorie(newCategorie);
    setNewCategorieName('');
    loadCategories();
    toast.success('Catégorie ajoutée avec succès');
  };

  const handleDeleteCategorie = (categorie: Categorie) => {
    setCategoryToDelete(categorie);
  };

  const confirmDelete = () => {
    if (categoryToDelete) {
      deleteCategorie(categoryToDelete.id);
      loadCategories();
      toast.success('Catégorie supprimée');
      setCategoryToDelete(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-green-700 mb-2">Gestion des Catégories</h1>
            <p className="text-gray-600">Ajoutez ou supprimez des catégories de produits</p>
          </div>

          {/* Ajouter une catégorie */}
          <Card className="mb-8 border-green-100">
            <CardHeader className="bg-green-50">
              <CardTitle className="text-green-700 flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Ajouter une nouvelle catégorie
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex gap-3">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="new-category">Nom de la catégorie</Label>
                  <Input
                    id="new-category"
                    value={newCategorieName}
                    onChange={(e) => setNewCategorieName(e.target.value)}
                    placeholder="Ex: boulangerie, confiserie..."
                    className="border-green-300 focus:border-green-500"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleAddCategorie();
                      }
                    }}
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={handleAddCategorie}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Liste des catégories */}
          <Card className="border-green-100">
            <CardHeader className="bg-green-50">
              <CardTitle className="text-green-700 flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Catégories existantes ({categories.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {categories.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Aucune catégorie disponible
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {categories.map((categorie) => (
                    <div
                      key={categorie.id}
                      className="flex items-center justify-between p-4 bg-white border border-green-200 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <Tag className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 capitalize">
                            {categorie.nom}
                          </p>
                          <p className="text-xs text-gray-500">
                            Ajoutée le {new Date(categorie.dateAjout).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteCategorie(categorie)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialog de confirmation de suppression */}
      <AlertDialog open={!!categoryToDelete} onOpenChange={() => setCategoryToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer la catégorie "{categoryToDelete?.nom}" ?
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}