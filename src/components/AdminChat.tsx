import { useState, useEffect, useRef } from 'react';
import { Send, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  sendMessage,
  getAllConversations,
  getConversationMessages,
  markMessagesAsRead,
  ChatMessage,
  ChatConversation,
} from '@/lib/chat';
import { notifyNewMessage } from '@/lib/notifications';

export default function AdminChat() {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<ChatConversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadConversations();
    // Actualiser toutes les 2 secondes
    const interval = setInterval(loadConversations, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.clientId);
      markMessagesAsRead(selectedConversation.clientId, 'admin');
    }
  }, [selectedConversation]);

  useEffect(() => {
    // Scroll vers le bas
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const loadConversations = () => {
    const convs = getAllConversations();
    setConversations(convs);
    
    // Si une conversation est sélectionnée, la mettre à jour
    if (selectedConversation) {
      const updated = convs.find((c) => c.clientId === selectedConversation.clientId);
      if (updated) {
        setSelectedConversation(updated);
        loadMessages(updated.clientId);
      }
    }
  };

  const loadMessages = (clientId: string) => {
    const msgs = getConversationMessages(clientId);
    setMessages(msgs);
  };

  const handleSelectConversation = (conv: ChatConversation) => {
    setSelectedConversation(conv);
    markMessagesAsRead(conv.clientId, 'admin');
    setTimeout(loadConversations, 100);
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    sendMessage(
      'admin',
      'El Mazraa Bardo',
      'admin',
      newMessage.trim()
    );

    setNewMessage('');
    loadMessages(selectedConversation.clientId);

    // Notifier le client
    await notifyNewMessage(
      'El Mazraa Bardo',
      newMessage.trim().substring(0, 50),
      false
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="grid grid-cols-3 gap-6 h-[600px]">
      {/* Liste des conversations */}
      <Card className="col-span-1 border-gray-800 bg-gray-900">
        <CardHeader className="bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-800">
          <CardTitle className="text-green-400 flex items-center">
            <MessageCircle className="mr-2 h-5 w-5" />
            Conversations
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[500px]">
            {conversations.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                Aucune conversation
              </div>
            ) : (
              <div className="divide-y divide-gray-800">
                {conversations.map((conv) => (
                  <div
                    key={conv.clientId}
                    onClick={() => handleSelectConversation(conv)}
                    className={`p-4 cursor-pointer hover:bg-gray-800 transition-colors ${
                      selectedConversation?.clientId === conv.clientId ? 'bg-gray-800' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-gray-200">{conv.clientName}</span>
                      {conv.unreadCount > 0 && (
                        <Badge variant="destructive" className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                          {conv.unreadCount}
                        </Badge>
                      )}
                    </div>
                    {conv.lastMessage && (
                      <>
                        <p className="text-sm text-gray-400 truncate">
                          {conv.lastMessage.senderType === 'admin' ? 'Vous: ' : ''}
                          {conv.lastMessage.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(conv.lastMessage.timestamp).toLocaleString('fr-FR', {
                            day: '2-digit',
                            month: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Zone de chat */}
      <Card className="col-span-2 border-gray-800 bg-gray-900">
        {selectedConversation ? (
          <>
            <CardHeader className="bg-gradient-to-r from-green-900 to-gray-900 border-b border-gray-800">
              <CardTitle className="text-green-400">{selectedConversation.clientName}</CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex flex-col h-[500px]">
              {/* Messages */}
              <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.senderType === 'admin' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[75%] rounded-lg p-3 ${
                          msg.senderType === 'admin'
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
                  ))}
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="p-4 border-t border-gray-800">
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
            </CardContent>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p>Sélectionnez une conversation</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}