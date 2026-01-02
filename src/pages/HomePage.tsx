import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Produit, Categorie } from '@/types';
import { getProduits } from '@/lib/storage';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import CategoryFilter from '@/components/CategoryFilter';
import SearchBar from '@/components/SearchBar';
import { ShoppingBag } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();
  const [produits, setProduits] = useState<Produit[]>([]);
  const [filteredProduits, setFilteredProduits] = useState<Produit[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Categorie | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadProduits();
  }, []);

  useEffect(() => {
    filterProduits();
  }, [produits, selectedCategory, searchQuery]);

  const loadProduits = () => {
    const allProduits = getProduits();
    // Filtrer uniquement les produits actifs
    const activeProduits = allProduits.filter(p => p.actif);
    setProduits(activeProduits);
  };

  const filterProduits = () => {
    let filtered = produits;

    // Filtre par catégorie
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.categorie === selectedCategory);
    }

    // Filtre par recherche
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.nom.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      );
    }

    setFilteredProduits(filtered);
  };

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-400 mb-2">
            Nos Produits
          </h1>
          <p className="text-gray-400">
            Découvrez notre sélection de produits frais et de qualité
          </p>
        </div>

        {/* Recherche */}
        <SearchBar value={searchQuery} onChange={setSearchQuery} />

        {/* Filtres par catégorie */}
        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Liste des produits */}
        {filteredProduits.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProduits.map((produit) => (
              <ProductCard
                key={produit.id}
                produit={produit}
                onClick={() => navigate(`/product/${produit.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <ShoppingBag className="h-16 w-16 text-green-800 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              {produits.length === 0 
                ? 'Aucun produit disponible pour le moment'
                : 'Aucun produit ne correspond à votre recherche'
              }
            </h3>
            <p className="text-gray-500">
              {produits.length === 0
                ? 'Revenez bientôt pour découvrir nos produits'
                : 'Essayez de modifier vos filtres ou votre recherche'
              }
            </p>
          </div>
        )}
      </main>
    </div>
  );
}