export interface Client {
  id: string;
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  password: string;
  dateInscription: string;
}

export interface Produit {
  id: string;
  nom: string;
  description: string;
  prix: number;
  stock: number;
  categorie: string;
  photos: string[]; // Base64 ou URLs
  actif: boolean;
  dateAjout: string;
}

export interface ProduitCommande {
  produitId: string;
  quantite: number;
  prixUnitaire: number;
  nomProduit: string;
}

export interface ArticleCommande {
  produitId: string;
  nom: string;
  prix: number;
  quantite: number;
  photo: string;
}

export type OrderStatus = 'nouvelle' | 'en préparation' | 'prête à emporter' | 'livrée' | 'annulée';

export interface Commande {
  id: string;
  clientId: string;
  clientNom: string;
  clientPrenom: string;
  clientEmail: string;
  clientTelephone: string;
  produits: ProduitCommande[];
  articles?: ArticleCommande[];
  total: number;
  statut: OrderStatus;
  dateCommande: string;
  dateModification?: string;
}

export interface CartItem {
  produit: Produit;
  quantite: number;
}

export interface Categorie {
  id: string;
  nom: string;
  dateAjout: string;
}