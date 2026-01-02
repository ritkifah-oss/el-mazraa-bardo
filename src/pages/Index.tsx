import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProduits } from '@/lib/storage';
import { Produit } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SearchBar from '@/components/SearchBar';
import CategoryFilter from '@/components/CategoryFilter';
import ChatButton from '@/components/ChatButton';
import { ShoppingCart, Plus, Phone, LogIn, User, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';

export default function Index() {
  const [produits, setProduits] = useState<Produit[]>([]);
  const [filteredProduits, setFilteredProduits] = useState<Produit[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { addToCart, cart } = useCart();
  const { currentUser } = useAuth();

  useEffect(() => {
    const allProduits = getProduits().filter(p => p.actif);
    setProduits(allProduits);
    setFilteredProduits(allProduits);
  }, []);

  useEffect(() => {
    let filtered = produits;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.categorie === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.nom.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProduits(filtered);
  }, [selectedCategory, searchQuery, produits]);

  const handleAddToCart = (produit: Produit) => {
    // Validate product data
    if (!produit || !produit.id) {
      toast.error('Produit invalide');
      return;
    }

    if (!produit.actif) {
      toast.error('Ce produit n\'est plus disponible');
      return;
    }

    if (produit.stock === 0 || produit.stock < 1) {
      toast.error('Ce produit est en rupture de stock');
      return;
    }

    if (!produit.prix || produit.prix <= 0) {
      toast.error('Prix du produit invalide');
      return;
    }

    const success = addToCart(produit, 1);
    if (success) {
      toast.success(`${produit.nom} ajouté au panier`);
    } else {
      toast.error('Impossible d\'ajouter ce produit. Stock insuffisant.');
    }
  };

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantite, 0);

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-gradient-to-r from-gray-900 to-black border-b border-gray-800 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <img 
                src="https://mgx-backend-cdn.metadl.com/generate/images/285865/2025-12-31/1c74c936-5460-4d3c-9677-881fffbeead7.png"
                alt="El Mazraa Bardo"
                className="h-12 w-12 object-contain rounded-full border-2 border-green-500"
              />
              <div>
                <h1 className="text-2xl font-bold text-green-400">El Mazraa Bardo</h1>
                <p className="text-xs text-green-500">La nature dans votre assiette</p>
              </div>
            </Link>

            <div className="flex items-center space-x-4">
              <a
                href="tel:+21620000000"
                className="hidden md:flex items-center space-x-2 text-green-400 hover:text-green-300 transition-colors"
              >
                <Phone className="h-5 w-5" />
                <span className="text-sm">Contact</span>
              </a>

              {currentUser ? (
                <Link to="/orders">
                  <Button variant="ghost" className="text-green-400 hover:text-green-300 hover:bg-gray-800">
                    <ShoppingBag className="h-5 w-5 mr-2" />
                    <span className="hidden md:inline">Mes Commandes</span>
                  </Button>
                </Link>
              ) : (
                <Link to="/login">
                  <Button variant="ghost" className="text-green-400 hover:text-green-300 hover:bg-gray-800">
                    <LogIn className="h-5 w-5 mr-2" />
                    <span className="hidden md:inline">Connexion</span>
                  </Button>
                </Link>
              )}

              <Link to="/cart">
                <Button className="relative bg-green-600 hover:bg-green-700">
                  <ShoppingCart className="h-5 w-5" />
                  {cartItemCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center bg-red-600">
                      {cartItemCount}
                    </Badge>
                  )}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-950 via-gray-900 to-black py-12 border-b border-gray-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-green-400 mb-4">
            Bienvenue chez El Mazraa Bardo
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            La nature dans votre assiette
          </p>
          <div className="max-w-2xl mx-auto">
            <SearchBar onSearch={setSearchQuery} />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Filtres */}
          <aside className="lg:w-64">
            <CategoryFilter
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-green-400">
                {selectedCategory === 'all' ? 'Tous les Produits' : selectedCategory}
              </h3>
              <p className="text-gray-400 text-sm mt-1">
                {filteredProduits.length} produit(s) disponible(s)
              </p>
            </div>

            {filteredProduits.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg">Aucun produit trouvé</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProduits.map((produit) => (
                  <Card
                    key={produit.id}
                    className="border-gray-800 bg-gray-900 hover:border-green-700 transition-all hover:shadow-lg hover:shadow-green-900/20"
                  >
                    <CardContent className="p-4">
                      <div className="aspect-square mb-4 rounded-lg overflow-hidden bg-gray-800">
                        <img
                          src={produit.photos?.[0] || produit.image}
                          alt={produit.nom}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <h3 className="font-semibold text-lg text-gray-200 line-clamp-2">
                            {produit.nom}
                          </h3>
                          <Badge variant="secondary" className="bg-green-900 text-green-300 ml-2">
                            {produit.categorie}
                          </Badge>
                        </div>

                        <p className="text-sm text-gray-400 line-clamp-2">
                          {produit.description}
                        </p>

                        <div className="flex items-center justify-between pt-2">
                          <div>
                            <p className="text-2xl font-bold text-green-400">
                              {Number(produit.prix).toFixed(3)} TND
                            </p>
                            <p className="text-xs text-gray-500">
                              Stock: {produit.stock}
                            </p>
                          </div>

                          <Button
                            onClick={() => handleAddToCart(produit)}
                            disabled={produit.stock === 0 || !produit.actif}
                            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:text-gray-500"
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Ajouter
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Chat Button */}
      <ChatButton />

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-black border-t border-gray-800 py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2024 El Mazraa Bardo - La nature dans votre assiette
          </p>
          <div className="flex justify-center space-x-4 mt-4">
            <a href="tel:+21620000000" className="text-green-400 hover:text-green-300">
              <Phone className="h-5 w-5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}