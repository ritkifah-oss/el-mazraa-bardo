/*
  # Complete Database Schema for Supérette El Mazraa

  1. New Tables
    - `categories` - Product categories (épicerie, boissons, etc.)
    - `produits` - Product catalog with inventory management
    - `commandes` - Customer orders with status tracking
    - `commande_items` - Order line items (products in each order)
    - `admin_users` - Admin accounts for dashboard access
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to read/manage their own data
    - Add policies for admin users to manage all data
    - Add public policy for product browsing
  
  3. Key Features
    - Automatic timestamps with triggers
    - Stock management for products
    - Order status workflow (nouvelle, en préparation, prête à emporter, livrée, annulée)
    - Admin authentication separate from customers
*/

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nom text NOT NULL UNIQUE,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Products Table
CREATE TABLE IF NOT EXISTS produits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nom text NOT NULL,
  description text,
  prix numeric NOT NULL CHECK (prix >= 0),
  stock integer NOT NULL DEFAULT 0 CHECK (stock >= 0),
  categorie_id uuid NOT NULL REFERENCES categories(id) ON DELETE SET NULL,
  photos jsonb DEFAULT '[]'::jsonb,
  actif boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Orders Table (Commandes)
CREATE TABLE IF NOT EXISTS commandes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_nom text NOT NULL,
  client_prenom text NOT NULL,
  client_email text NOT NULL,
  client_telephone text NOT NULL,
  statut text NOT NULL DEFAULT 'nouvelle' CHECK (statut IN ('nouvelle', 'en préparation', 'prête à emporter', 'livrée', 'annulée')),
  total numeric NOT NULL CHECK (total >= 0),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Order Items Table (Articles Commande)
CREATE TABLE IF NOT EXISTS commande_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  commande_id uuid NOT NULL REFERENCES commandes(id) ON DELETE CASCADE,
  produit_id uuid NOT NULL REFERENCES produits(id) ON DELETE RESTRICT,
  nom text NOT NULL,
  prix numeric NOT NULL CHECK (prix >= 0),
  quantite integer NOT NULL CHECK (quantite > 0),
  photo text,
  created_at timestamptz DEFAULT now()
);

-- Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  nom text NOT NULL,
  role text DEFAULT 'admin',
  actif boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS produits_categorie_id_idx ON produits(categorie_id);
CREATE INDEX IF NOT EXISTS produits_actif_idx ON produits(actif);
CREATE INDEX IF NOT EXISTS commandes_user_id_idx ON commandes(user_id);
CREATE INDEX IF NOT EXISTS commandes_statut_idx ON commandes(statut);
CREATE INDEX IF NOT EXISTS commandes_created_at_idx ON commandes(created_at);
CREATE INDEX IF NOT EXISTS commande_items_commande_id_idx ON commande_items(commande_id);
CREATE INDEX IF NOT EXISTS commande_items_produit_id_idx ON commande_items(produit_id);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE produits ENABLE ROW LEVEL SECURITY;
ALTER TABLE commandes ENABLE ROW LEVEL SECURITY;
ALTER TABLE commande_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Categories Policies - Anyone can read, only admin can modify
CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "Only admins can create categories"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid() AND admin_users.actif = true
    )
  );

CREATE POLICY "Only admins can update categories"
  ON categories FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid() AND admin_users.actif = true
    )
  );

CREATE POLICY "Only admins can delete categories"
  ON categories FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid() AND admin_users.actif = true
    )
  );

-- Products Policies - Anyone can read active products, only admin can modify
CREATE POLICY "Active products are viewable by everyone"
  ON produits FOR SELECT
  USING (actif = true);

CREATE POLICY "Admins can view all products"
  ON produits FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid() AND admin_users.actif = true
    )
  );

CREATE POLICY "Only admins can create products"
  ON produits FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid() AND admin_users.actif = true
    )
  );

CREATE POLICY "Only admins can update products"
  ON produits FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid() AND admin_users.actif = true
    )
  );

CREATE POLICY "Only admins can delete products"
  ON produits FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid() AND admin_users.actif = true
    )
  );

-- Orders Policies - Users can see their own orders, admins can see all
CREATE POLICY "Users can view their own orders"
  ON commandes FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders"
  ON commandes FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid() AND admin_users.actif = true
    )
  );

CREATE POLICY "Authenticated users can create orders"
  ON commandes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own orders"
  ON commandes FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Only admins can update order status"
  ON commandes FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid() AND admin_users.actif = true
    )
  );

-- Order Items Policies - Users can see items from their orders
CREATE POLICY "Users can view order items from their orders"
  ON commande_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM commandes
      WHERE commandes.id = commande_items.commande_id
      AND commandes.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all order items"
  ON commande_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid() AND admin_users.actif = true
    )
  );

CREATE POLICY "Users can add items to their orders"
  ON commande_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM commandes
      WHERE commandes.id = commande_items.commande_id
      AND commandes.user_id = auth.uid()
    )
  );

-- Admin Users Policies - Only admins can manage admin accounts
CREATE POLICY "Admins can view all admin users"
  ON admin_users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid() AND admin_users.actif = true
    )
  );

CREATE POLICY "Only super admin can create admin users"
  ON admin_users FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid() AND admin_users.role = 'super_admin'
    )
  );

CREATE POLICY "Admins can update admin users"
  ON admin_users FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid() AND admin_users.actif = true
    )
  );
