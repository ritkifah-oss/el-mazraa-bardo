import { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Chat from './Chat';
import { getUnreadCount } from '@/lib/chat';
import { useAuth } from '@/contexts/AuthContext';

export default function ChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      updateUnreadCount();
      // Mettre à jour toutes les 3 secondes
      const interval = setInterval(updateUnreadCount, 3000);
      return () => clearInterval(interval);
    }
  }, [currentUser]);

  const updateUnreadCount = () => {
    if (currentUser) {
      const count = getUnreadCount(currentUser.id, 'client');
      setUnreadCount(count);
    }
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Quand on ouvre le chat, réinitialiser le compteur
      setTimeout(updateUnreadCount, 500);
    }
  };

  if (!currentUser) return null;

  return (
    <>
      {/* Bouton flottant */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={handleToggle}
          size="lg"
          className="relative h-14 w-14 rounded-full bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl transition-all"
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <>
              <MessageCircle className="h-6 w-6" />
              {unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {unreadCount}
                </Badge>
              )}
            </>
          )}
        </Button>
      </div>

      {/* Fenêtre de chat */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 h-[500px] bg-gray-900 border border-gray-800 rounded-lg shadow-2xl">
          <Chat onClose={() => setIsOpen(false)} onMessageSent={updateUnreadCount} />
        </div>
      )}
    </>
  );
}