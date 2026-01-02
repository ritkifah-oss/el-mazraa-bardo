// Gestion du système de chat client-admin

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderType: 'client' | 'admin';
  message: string;
  timestamp: string;
  read: boolean;
}

export interface ChatConversation {
  clientId: string;
  clientName: string;
  messages: ChatMessage[];
  lastMessage?: ChatMessage;
  unreadCount: number;
}

const STORAGE_KEY = 'elmazraa_chat_messages';

// Récupérer tous les messages
export const getAllMessages = (): ChatMessage[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

// Sauvegarder tous les messages
const saveAllMessages = (messages: ChatMessage[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
};

// Envoyer un message
export const sendMessage = (
  senderId: string,
  senderName: string,
  senderType: 'client' | 'admin',
  messageText: string
): ChatMessage => {
  const newMessage: ChatMessage = {
    id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    senderId,
    senderName,
    senderType,
    message: messageText,
    timestamp: new Date().toISOString(),
    read: false,
  };

  const messages = getAllMessages();
  messages.push(newMessage);
  saveAllMessages(messages);

  return newMessage;
};

// Récupérer les messages d'une conversation (client spécifique)
export const getConversationMessages = (clientId: string): ChatMessage[] => {
  const allMessages = getAllMessages();
  return allMessages
    .filter((msg) => msg.senderId === clientId || msg.senderType === 'admin')
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
};

// Marquer les messages comme lus
export const markMessagesAsRead = (clientId: string, readerType: 'client' | 'admin'): void => {
  const messages = getAllMessages();
  const updated = messages.map((msg) => {
    // Si c'est un client qui lit, marquer les messages admin comme lus
    if (readerType === 'client' && msg.senderType === 'admin' && msg.senderId !== clientId) {
      return { ...msg, read: true };
    }
    // Si c'est un admin qui lit, marquer les messages du client comme lus
    if (readerType === 'admin' && msg.senderId === clientId && msg.senderType === 'client') {
      return { ...msg, read: true };
    }
    return msg;
  });
  saveAllMessages(updated);
};

// Compter les messages non lus pour un client
export const getUnreadCount = (clientId: string, viewerType: 'client' | 'admin'): number => {
  const messages = getAllMessages();
  return messages.filter((msg) => {
    if (viewerType === 'client') {
      // Client voit les messages non lus de l'admin
      return msg.senderType === 'admin' && !msg.read;
    } else {
      // Admin voit les messages non lus de ce client
      return msg.senderId === clientId && msg.senderType === 'client' && !msg.read;
    }
  }).length;
};

// Récupérer toutes les conversations (pour l'admin)
export const getAllConversations = (): ChatConversation[] => {
  const allMessages = getAllMessages();
  const conversationsMap = new Map<string, ChatConversation>();

  allMessages.forEach((msg) => {
    if (msg.senderType === 'client') {
      const clientId = msg.senderId;
      if (!conversationsMap.has(clientId)) {
        conversationsMap.set(clientId, {
          clientId,
          clientName: msg.senderName,
          messages: [],
          unreadCount: 0,
        });
      }
      const conv = conversationsMap.get(clientId)!;
      conv.messages.push(msg);
      if (!msg.read) {
        conv.unreadCount++;
      }
    }
  });

  // Ajouter aussi les messages admin aux conversations
  allMessages.forEach((msg) => {
    if (msg.senderType === 'admin') {
      conversationsMap.forEach((conv) => {
        conv.messages.push(msg);
      });
    }
  });

  // Trier les messages et définir le dernier message
  const conversations = Array.from(conversationsMap.values()).map((conv) => {
    conv.messages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    conv.lastMessage = conv.messages[conv.messages.length - 1];
    return conv;
  });

  // Trier par dernier message
  conversations.sort((a, b) => {
    const timeA = a.lastMessage ? new Date(a.lastMessage.timestamp).getTime() : 0;
    const timeB = b.lastMessage ? new Date(b.lastMessage.timestamp).getTime() : 0;
    return timeB - timeA;
  });

  return conversations;
};

// Compter le total des messages non lus (pour l'admin)
export const getTotalUnreadCount = (): number => {
  const conversations = getAllConversations();
  return conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);
};