import { useState, useEffect, useRef } from 'react';
import { Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import { sendMessage, getConversationMessages, markMessagesAsRead, ChatMessage } from '@/lib/chat';
import { notifyNewMessage } from '@/lib/notifications';

interface ChatProps {
  onClose: () => void;
  onMessageSent?: () => void;
}

export default function Chat({ onClose, onMessageSent }: ChatProps) {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentUser) {
      loadMessages();
      markMessagesAsRead(currentUser.id, 'client');
      
      // Actualiser les messages toutes les 2 secondes
      const interval = setInterval(loadMessages, 2000);
      return () => clearInterval(interval);
    }
  }, [currentUser]);

  useEffect(() => {
    // Scroll vers le bas quand de nouveaux messages arrivent
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const loadMessages = () => {
    if (currentUser) {
      const msgs = getConversationMessages(currentUser.id);
      setMessages(msgs);
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !currentUser) return;

    const msg = sendMessage(
      currentUser.id,
      `${currentUser.prenom} ${currentUser.nom}`,
      'client',
      newMessage.trim()
    );

    setNewMessage('');
    loadMessages();
    
    if (onMessageSent) {
      onMessageSent();
    }

    // Notifier l'admin
    await notifyNewMessage(
      `${currentUser.prenom} ${currentUser.nom}`,
      newMessage.trim().substring(0, 50),
      true
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!currentUser) return null;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gradient-to-r from-green-900 to-gray-900">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-green-600 flex items-center justify-center">
            <span className="text-white font-bold">EM</span>
          </div>
          <div>
            <h3 className="font-semibold text-green-400">El Mazraa Bardo</h3>
            <p className="text-xs text-gray-400">Support client</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="hover:bg-gray-800"
        >
          <X className="h-5 w-5 text-gray-400" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm">
                Aucun message pour le moment.
                <br />
                Envoyez un message pour commencer !
              </p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.senderType === 'client' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] rounded-lg p-3 ${
                    msg.senderType === 'client'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-800 text-gray-200'
                  }`}
                >
                  <p className="text-sm break-words">{msg.message}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {new Date(msg.timestamp).toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-gray-800 bg-gray-900">
        <div className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Écrivez votre message..."
            className="flex-1 bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-500 focus:border-green-500"
          />
          <Button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className="bg-green-600 hover:bg-green-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}