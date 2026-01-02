/*
  # Add Default Categories
  
  Insert default product categories used by the supermarket application.
*/

INSERT INTO categories (nom, description) VALUES
  ('épicerie', 'Produits alimentaires et articles de base'),
  ('boissons', 'Boissons variées - eau, jus, sodas'),
  ('fruits et légumes', 'Fruits et légumes frais'),
  ('produits laitiers', 'Lait, yaourt, fromage et dérivés'),
  ('hygiène', 'Produits de nettoyage et hygiène personnelle')
ON CONFLICT (nom) DO NOTHING;
