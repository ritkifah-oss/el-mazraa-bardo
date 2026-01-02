// Gestion des notifications push

export interface NotificationPayload {
  title: string;
  body: string;
  tag?: string;
  icon?: string;
  data?: Record<string, unknown>;
  actions?: Array<{ action: string; title: string }>;
}

// Vérifier si les notifications sont supportées
export const isNotificationSupported = (): boolean => {
  return 'Notification' in window && 'serviceWorker' in navigator;
};

// Demander la permission pour les notifications
export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!isNotificationSupported()) {
    return 'denied';
  }

  const permission = await Notification.requestPermission();
  return permission;
};

// Enregistrer le Service Worker
export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  if (!('serviceWorker' in navigator)) {
    console.log('Service Worker not supported');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    console.log('Service Worker registered:', registration);
    return registration;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
    return null;
  }
};

// Envoyer une notification locale
export const sendLocalNotification = async (payload: NotificationPayload): Promise<void> => {
  if (!isNotificationSupported()) {
    console.log('Notifications not supported');
    return;
  }

  const permission = await requestNotificationPermission();
  if (permission !== 'granted') {
    console.log('Notification permission denied');
    return;
  }

  const registration = await navigator.serviceWorker.ready;
  
  await registration.showNotification(payload.title, {
    body: payload.body,
    icon: payload.icon || 'https://mgx-backend-cdn.metadl.com/generate/images/285865/2026-01-02/cff0d7d0-a2cb-45cc-ab15-0b998df805d3.png',
    badge: 'https://mgx-backend-cdn.metadl.com/generate/images/285865/2026-01-02/7ab51d60-dce2-4d23-b468-76fcc853e252.png',
    tag: payload.tag || 'notification',
    vibrate: [200, 100, 200],
    data: payload.data || {},
    actions: payload.actions || [],
  });
};

// Notification pour changement de statut de commande (Client)
export const notifyOrderStatusChange = async (
  orderNumber: string,
  newStatus: string
): Promise<void> => {
  const statusMessages: Record<string, string> = {
    'prête à emporter': `Votre commande #${orderNumber} est prête à être récupérée !`,
    'livrée': `Votre commande #${orderNumber} a été livrée avec succès !`,
  };

  const message = statusMessages[newStatus];
  if (!message) return;

  await sendLocalNotification({
    title: 'El Mazraa Bardo',
    body: message,
    tag: `order-${orderNumber}`,
    data: { url: '/orders', orderNumber },
    actions: [
      { action: 'view', title: 'Voir la commande' },
      { action: 'close', title: 'Fermer' },
    ],
  });
};

// Notification pour nouvelle commande (Admin)
export const notifyNewOrder = async (
  orderNumber: string,
  clientName: string,
  total: number
): Promise<void> => {
  await sendLocalNotification({
    title: '🔔 Nouvelle commande !',
    body: `${clientName} - ${total.toFixed(3)} TND\nCommande #${orderNumber}`,
    tag: `new-order-${orderNumber}`,
    data: { url: '/admin/orders', orderNumber },
    actions: [
      { action: 'view', title: 'Voir la commande' },
      { action: 'close', title: 'Fermer' },
    ],
  });
};

// Notification pour nouveau message (Admin et Client)
export const notifyNewMessage = async (
  senderName: string,
  messagePreview: string,
  isAdmin: boolean
): Promise<void> => {
  await sendLocalNotification({
    title: `💬 ${senderName}`,
    body: messagePreview,
    tag: 'new-message',
    data: { url: isAdmin ? '/admin' : '/' },
    actions: [
      { action: 'view', title: 'Voir le message' },
      { action: 'close', title: 'Fermer' },
    ],
  });
};

// Initialiser les notifications au chargement de l'app
export const initializeNotifications = async (): Promise<void> => {
  await registerServiceWorker();
  
  // Demander la permission si pas encore fait
  const permission = Notification.permission;
  if (permission === 'default') {
    // On attend un peu avant de demander pour ne pas être trop intrusif
    setTimeout(async () => {
      await requestNotificationPermission();
    }, 5000);
  }
};