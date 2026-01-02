# Site Web El Mazraa Bardo - Plan de Développement

## Design Guidelines

### Identité Visuelle
- **Nom**: El Mazraa Bardo
- **Slogan**: "la nature dans votre assiette"
- **Logo**: téléchargement.jpeg (à copier dans public/assets/)
- **Style**: Interface professionnelle verte et blanche

### Palette de Couleurs
- Primary: #22c55e (Vert nature - boutons, accents)
- Secondary: #16a34a (Vert foncé - hover states)
- Background: #ffffff (Blanc)
- Surface: #f0fdf4 (Vert très clair - cards)
- Text Primary: #166534 (Vert foncé)
- Text Secondary: #6b7280 (Gris)
- Border: #bbf7d0 (Vert clair)
- Error: #ef4444 (Rouge)
- Success: #22c55e (Vert)

### Typographie
- Font Family: Nunito (Google Fonts)
- Heading1: Nunito font-weight 700 (32px)
- Heading2: Nunito font-weight 600 (24px)
- Heading3: Nunito font-weight 600 (20px)
- Body: Nunito font-weight 400 (16px)
- Button: Nunito font-weight 600 (16px)

### Composants Clés
- **Buttons**: Vert primary (#22c55e), texte blanc, rounded-lg, hover: vert foncé
- **Cards**: Fond blanc, border vert clair, shadow-sm, rounded-lg
- **Inputs**: Border vert clair, focus: border vert primary
- **Navigation**: Fond blanc, shadow-sm, sticky top

---

## Structure de la Base de Données (localStorage)

### 1. Clients
```typescript
{
  id: string,
  nom: string,
  prenom: string,
  telephone: string,
  email: string,
  motDePasse: string (hashé),
  dateInscription: string
}
```

### 2. Produits
```typescript
{
  id: string,
  nom: string,
  photos: string[],
  prix: number,
  stock: number,
  description: string,
  categorie: string,
  actif: boolean,
  dateAjout: string
}
```

### 3. Commandes
```typescript
{
  id: string,
  clientId: string,
  produits: [{
    produitId: string,
    quantite: number,
    prixUnitaire: number
  }],
  total: number,
  statut: 'nouvelle' | 'en_preparation' | 'prete' | 'livree' | 'annulee',
  dateCommande: string,
  dateModification: string
}
```

### 4. Session Admin
```typescript
{
  isAdmin: boolean,
  codeAdmin: '10072012'
}
```

---

## Fichiers à Créer

### 1. Configuration et Utils
- [x] `src/lib/storage.ts` - Gestion localStorage (clients, produits, commandes)
- [x] `src/lib/auth.ts` - Authentification et gestion session
- [x] `src/types/index.ts` - Types TypeScript

### 2. Contextes
- [x] `src/contexts/AuthContext.tsx` - Context authentification client
- [x] `src/contexts/CartContext.tsx` - Context panier
- [x] `src/contexts/AdminContext.tsx` - Context admin

### 3. Pages Principales
- [x] `src/pages/LoginPage.tsx` - Page connexion/inscription (première page)
- [x] `src/pages/HomePage.tsx` - Page d'accueil avec catalogue
- [x] `src/pages/ProductDetailPage.tsx` - Détail produit
- [x] `src/pages/CartPage.tsx` - Page panier
- [x] `src/pages/OrderHistoryPage.tsx` - Historique commandes client
- [x] `src/pages/AdminLoginPage.tsx` - Connexion admin
- [x] `src/pages/AdminDashboard.tsx` - Dashboard admin
- [x] `src/pages/AdminProducts.tsx` - Gestion produits
- [x] `src/pages/AdminOrders.tsx` - Gestion commandes

### 4. Composants
- [x] `src/components/Navbar.tsx` - Navigation principale
- [x] `src/components/ProductCard.tsx` - Card produit
- [x] `src/components/CategoryFilter.tsx` - Filtre catégories
- [x] `src/components/SearchBar.tsx` - Barre de recherche
- [x] `src/components/CartItem.tsx` - Item dans panier
- [x] `src/components/OrderCard.tsx` - Card commande
- [x] `src/components/AdminSidebar.tsx` - Sidebar admin
- [x] `src/components/ProductForm.tsx` - Formulaire produit (admin)
- [x] `src/components/OrderStatusBadge.tsx` - Badge statut commande

### 5. Hooks Personnalisés
- [x] `src/hooks/useAuth.ts` - Hook authentification
- [x] `src/hooks/useCart.ts` - Hook panier
- [x] `src/hooks/useProducts.ts` - Hook produits
- [x] `src/hooks/useOrders.ts` - Hook commandes

### 6. Configuration
- [x] `index.html` - Mise à jour titre et meta + import Nunito
- [x] `src/index.css` - Styles globaux avec Nunito
- [x] `src/App.tsx` - Routes et providers
- [x] `public/assets/logo.jpeg` - Logo copié

---

## Fonctionnalités Clés

### Authentification Obligatoire
- Page de connexion/inscription affichée en premier
- Redirection automatique si non connecté
- Session persistante avec localStorage

### Espace Client
- Catalogue avec 0 produits au départ
- Recherche et filtres par catégorie
- Ajout au panier avec vérification stock
- Validation commande avec décrément automatique du stock
- Historique et suivi des commandes

### Espace Admin
- Accès sécurisé par code 10072012
- CRUD complet des produits
- Gestion photos multiples
- Mise à jour stock manuelle
- Gestion statuts commandes
- Vue détaillée des commandes avec coordonnées clients

### Gestion du Stock
- Décrément automatique lors des commandes
- Produits en rupture non commandables
- Affichage temps réel de la disponibilité

---

## Ordre d'Implémentation

1. ✅ Configuration de base (types, storage, auth)
2. ✅ Contextes (Auth, Cart, Admin)
3. ✅ Hooks personnalisés
4. ✅ Composants réutilisables
5. ✅ Pages client (Login, Home, Product, Cart, History)
6. ✅ Pages admin (Login, Dashboard, Products, Orders)
7. ✅ Intégration complète et routing
8. ✅ Tests et vérifications
9. ✅ Build final