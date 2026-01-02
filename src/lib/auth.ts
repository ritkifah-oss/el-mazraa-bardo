import { Client } from '@/types';
import { getClientByEmail, saveClient, setCurrentUser, clearCurrentUser, clearCart, setAdminSession } from './storage';

// Simple hash function (pour la démo - en production, utiliser bcrypt côté serveur)
const hashPassword = (password: string): string => {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(36);
};

export const registerClient = (
  nom: string,
  prenom: string,
  telephone: string,
  email: string,
  password: string
): { success: boolean; message: string; client?: Client } => {
  // Vérifier si l'email existe déjà
  const existingClient = getClientByEmail(email);
  if (existingClient) {
    return { success: false, message: 'Cet email est déjà utilisé' };
  }

  // Créer le nouveau client
  const newClient: Client = {
    id: `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    nom,
    prenom,
    telephone,
    email,
    password: hashPassword(password),
    dateInscription: new Date().toISOString(),
  };

  saveClient(newClient);
  setCurrentUser(newClient);

  return { success: true, message: 'Inscription réussie', client: newClient };
};

export const loginClient = (
  email: string,
  password: string
): { success: boolean; message: string; client?: Client } => {
  const client = getClientByEmail(email);
  
  if (!client) {
    return { success: false, message: 'Email ou mot de passe incorrect' };
  }

  const hashedPassword = hashPassword(password);
  if (client.password !== hashedPassword) {
    return { success: false, message: 'Email ou mot de passe incorrect' };
  }

  setCurrentUser(client);
  return { success: true, message: 'Connexion réussie', client };
};

export const logoutClient = (): void => {
  clearCurrentUser();
  clearCart();
  setAdminSession(null);
};

export const validateAdminCode = (code: string): boolean => {
  return code === '10072012';
};