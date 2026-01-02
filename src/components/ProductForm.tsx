import { useState, useRef } from 'react';
import { Produit } from '@/types';
import { getCategorieNames } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

interface ProductFormProps {
  produit?: Produit;
  onSubmit: (produit: Omit<Produit, 'id' | 'dateAjout'>) => void;
  onCancel: () => void;
}

export default function ProductForm({ produit, onSubmit, onCancel }: ProductFormProps) {
  const [nom, setNom] = useState(produit?.nom || '');
  const [description, setDescription] = useState(produit?.description || '');
  const [prix, setPrix] = useState(produit?.prix.toString() || '');
  const [stock, setStock] = useState(produit?.stock.toString() || '');
  const [categorie, setCategorie] = useState(produit?.categorie || '');
  const [photos, setPhotos] = useState<string[]>(produit?.photos || []);
  const [actif, setActif] = useState(produit?.actif ?? true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = getCategorieNames();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newPhotos: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} n'est pas une image valide`);
        continue;
      }

      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} est trop volumineux (max 5MB)`);
        continue;
      }

      try {
        const base64 = await convertToBase64(file);
        newPhotos.push(base64);
      } catch (error) {
        toast.error(`Erreur lors du chargement de ${file.name}`);
      }
    }

    if (newPhotos.length > 0) {
      setPhotos([...photos, ...newPhotos]);
      toast.success(`${newPhotos.length} photo(s) ajoutée(s)`);
    }

    // Réinitialiser l'input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    setPhotos(newPhotos);
    toast.success('Photo supprimée');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nom || !description || !prix || !stock || !categorie) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (photos.length === 0) {
      toast.error('Veuillez ajouter au moins une photo');
      return;
    }

    const prixNum = parseFloat(prix);
    const stockNum = parseInt(stock);

    if (isNaN(prixNum) || prixNum <= 0) {
      toast.error('Le prix doit être un nombre positif');
      return;
    }

    if (isNaN(stockNum) || stockNum < 0) {
      toast.error('Le stock doit être un nombre positif ou zéro');
      return;
    }

    onSubmit({
      nom,
      description,
      prix: prixNum,
      stock: stockNum,
      categorie,
      photos,
      actif,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="nom">Nom du produit *</Label>
        <Input
          id="nom"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          placeholder="Ex: Lait frais"
          className="border-green-300 focus:border-green-500"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Décrivez le produit..."
          rows={3}
          className="border-green-300 focus:border-green-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="prix">Prix (TND) *</Label>
          <Input
            id="prix"
            type="number"
            step="0.001"
            value={prix}
            onChange={(e) => setPrix(e.target.value)}
            placeholder="0.000"
            className="border-green-300 focus:border-green-500"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="stock">Stock *</Label>
          <Input
            id="stock"
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            placeholder="0"
            className="border-green-300 focus:border-green-500"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="categorie">Catégorie *</Label>
        <Select value={categorie} onValueChange={setCategorie}>
          <SelectTrigger className="border-green-300 focus:border-green-500">
            <SelectValue placeholder="Sélectionnez une catégorie" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Upload de photos */}
      <div className="space-y-2">
        <Label>Photos du produit *</Label>
        <div className="border-2 border-dashed border-green-300 rounded-lg p-6 text-center">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            multiple
            onChange={handleFileChange}
            className="hidden"
            id="photo-upload"
          />
          <label htmlFor="photo-upload" className="cursor-pointer">
            <Upload className="h-12 w-12 text-green-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-1">
              Cliquez pour ajouter des photos
            </p>
            <p className="text-xs text-gray-500">
              JPG, PNG, GIF, WEBP (max 5MB par photo)
            </p>
          </label>
        </div>

        {/* Aperçu des photos */}
        {photos.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mt-4">
            {photos.map((photo, index) => (
              <div key={index} className="relative group">
                <img
                  src={photo}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border-2 border-green-200"
                />
                <button
                  type="button"
                  onClick={() => removePhoto(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
                {index === 0 && (
                  <div className="absolute bottom-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                    Photo principale
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="actif"
          checked={actif}
          onChange={(e) => setActif(e.target.checked)}
          className="rounded border-green-300 text-green-600 focus:ring-green-500"
        />
        <Label htmlFor="actif" className="cursor-pointer">
          Produit actif (visible pour les clients)
        </Label>
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          className="flex-1 bg-green-600 hover:bg-green-700"
        >
          {produit ? 'Mettre à jour' : 'Ajouter le produit'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          Annuler
        </Button>
      </div>
    </form>
  );
}