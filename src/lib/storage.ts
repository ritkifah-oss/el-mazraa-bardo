import { Client, Produit, Commande, Categorie, OrderStatus, CartItem } from '@/types';

// Clés de stockage
const STORAGE_KEYS = {
  CLIENTS: 'elmazraa_clients',
  PRODUITS: 'elmazraa_produits',
  COMMANDES: 'elmazraa_commandes',
  CURRENT_USER: 'elmazraa_current_user',
  CATEGORIES: 'elmazraa_categories',
  CART: 'elmazraa_cart',
  ADMIN_SESSION: 'elmazraa_admin_session',
};

// Catégories par défaut
const DEFAULT_CATEGORIES: Categorie[] = [
  { id: '1', nom: 'épicerie', dateAjout: new Date().toISOString() },
  { id: '2', nom: 'boissons', dateAjout: new Date().toISOString() },
  { id: '3', nom: 'fruits et légumes', dateAjout: new Date().toISOString() },
  { id: '4', nom: 'produits laitiers', dateAjout: new Date().toISOString() },
  { id: '5', nom: 'hygiène', dateAjout: new Date().toISOString() },
];

// Initialiser les catégories si elles n'existent pas
const initializeCategories = () => {
  const categories = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
  if (!categories) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));
  }
};

// Initialiser au chargement
initializeCategories();

// Clients
export const getClients = (): Client[] => {
  const data = localStorage.getItem(STORAGE_KEYS.CLIENTS);
  return data ? JSON.parse(data) : [];
};

export const saveClients = (clients: Client[]): void => {
  localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
};

export const addClient = (client: Client): void => {
  const clients = getClients();
  clients.push(client);
  saveClients(clients);
};

export const saveClient = (client: Client): void => {
  addClient(client);
};

export const getClientByEmail = (email: string): Client | undefined => {
  const clients = getClients();
  return clients.find((c) => c.email === email);
};

export const getCurrentUser = (): Client | null => {
  const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return data ? JSON.parse(data) : null;
};

export const setCurrentUser = (client: Client | null): void => {
  if (client) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(client));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
};

export const clearCurrentUser = (): void => {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
};

// Produits
export const getProduits = (): Produit[] => {
  const data = localStorage.getItem(STORAGE_KEYS.PRODUITS);
  return data ? JSON.parse(data) : [];
};

export const saveProduits = (produits: Produit[]): void => {
  localStorage.setItem(STORAGE_KEYS.PRODUITS, JSON.stringify(produits));
};

export const addProduit = (produit: Produit): void => {
  const produits = getProduits();
  produits.push(produit);
  saveProduits(produits);
};

export const updateProduit = (id: string, updatedProduit: Partial<Produit>): void => {
  const produits = getProduits();
  const index = produits.findIndex((p) => p.id === id);
  if (index !== -1) {
    produits[index] = { ...produits[index], ...updatedProduit };
    saveProduits(produits);
  }
};

export const deleteProduit = (id: string): void => {
  const produits = getProduits();
  const filtered = produits.filter((p) => p.id !== id);
  saveProduits(filtered);
};

export const getProduitById = (id: string): Produit | undefined => {
  const produits = getProduits();
  return produits.find((p) => p.id === id);
};

export const decrementStock = (produitId: string, quantite: number): void => {
  const produits = getProduits();
  const index = produits.findIndex((p) => p.id === produitId);
  if (index !== -1) {
    produits[index].stock = Math.max(0, produits[index].stock - quantite);
    saveProduits(produits);
  }
};

// Commandes
export const getCommandes = (): Commande[] => {
  const data = localStorage.getItem(STORAGE_KEYS.COMMANDES);
  return data ? JSON.parse(data) : [];
};

export const saveCommandes = (commandes: Commande[]): void => {
  localStorage.setItem(STORAGE_KEYS.COMMANDES, JSON.stringify(commandes));
};

export const addCommande = (commande: Commande): void => {
  const commandes = getCommandes();
  commandes.push(commande);
  saveCommandes(commandes);
};

export const updateCommandeStatus = (id: string, statut: string): void => {
  const commandes = getCommandes();
  const index = commandes.findIndex((c) => c.id === id);
  if (index !== -1) {
    commandes[index].statut = statut as OrderStatus;
    saveCommandes(commandes);
  }
};

export const getCommandesByClientId = (clientId: string): Commande[] => {
  const commandes = getCommandes();
  return commandes.filter((c) => c.clientId === clientId);
};

export const getCommandesByClient = (clientId: string): Commande[] => {
  return getCommandesByClientId(clientId);
};

// Catégories
export const getCategories = (): Categorie[] => {
  const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
  return data ? JSON.parse(data) : DEFAULT_CATEGORIES;
};

export const saveCategories = (categories: Categorie[]): void => {
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
};

export const addCategorie = (categorie: Categorie): void => {
  const categories = getCategories();
  categories.push(categorie);
  saveCategories(categories);
};

export const deleteCategorie = (id: string): void => {
  const categories = getCategories();
  const filtered = categories.filter((c) => c.id !== id);
  saveCategories(filtered);
};

export const getCategorieNames = (): string[] => {
  const categories = getCategories();
  return categories.map((c) => c.nom);
};

// Panier
export const getCart = (): CartItem[] => {
  const data = localStorage.getItem(STORAGE_KEYS.CART);
  return data ? JSON.parse(data) : [];
};

export const saveCart = (cart: CartItem[]): void => {
  localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
};

export const clearCart = (): void => {
  localStorage.removeItem(STORAGE_KEYS.CART);
};

// Admin Session
interface AdminSession {
  isAdmin: boolean;
  timestamp: number;
}

export const isAdminLoggedIn = (): boolean => {
  const data = localStorage.getItem(STORAGE_KEYS.ADMIN_SESSION);
  if (!data) return false;
  
  const session: AdminSession = JSON.parse(data);
  const ONE_HOUR = 60 * 60 * 1000;
  
  if (Date.now() - session.timestamp > ONE_HOUR) {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
    return false;
  }
  
  return session.isAdmin;
};

export const setAdminSession = (session: AdminSession | null): void => {
  if (session) {
    localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, JSON.stringify(session));
  } else {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
  }
};