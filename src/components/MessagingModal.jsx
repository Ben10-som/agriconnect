import React, { useState, useEffect } from 'react';
import { sendMessage, subscribeToOrderMessages } from '../services/messagingService';
import firebaseAuth from '../services/firebaseAuthService';

const MessagingModal = ({ visible, order, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const user = firebaseAuth.getCurrentUser();

  useEffect(() => {
    if (!visible || !order || !order.id) return;

    // S'abonner aux messages de cette commande
    const unsubscribe = subscribeToOrderMessages(order.id, (messagesData) => {
      setMessages(messagesData);
    });

    return () => unsubscribe();
  }, [visible, order]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user || !order) return;

    try {
      setLoading(true);
      
      // Déterminer le destinataire (l'autre partie)
      const recipientUid = user.uid === order.buyerUid ? order.sellerUid : order.buyerUid;
      
      await sendMessage(
        order.id,
        user.uid,
        user.displayName || user.email,
        newMessage.trim(),
        recipientUid
      );

      setNewMessage('');
    } catch (error) {
      console.error('Erreur envoi message', error);
      alert('Erreur lors de l\'envoi du message');
    } finally {
      setLoading(false);
    }
  };

  if (!visible || !order) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl h-[80vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="font-bold text-lg">Messages - {order.produit}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              Aucun message pour le moment
            </div>
          ) : (
            messages.map((msg) => {
              const isOwn = msg.senderUid === user?.uid;
              return (
                <div
                  key={msg.id}
                  className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      isOwn
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    <div className="text-xs opacity-75 mb-1">
                      {msg.senderName}
                    </div>
                    <div>{msg.message}</div>
                    <div className="text-xs opacity-75 mt-1">
                      {msg.createdAt?.toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="border-t p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Tapez votre message..."
              className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              disabled={loading}
            />
            <button
              onClick={handleSendMessage}
              disabled={loading || !newMessage.trim()}
              className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Envoyer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagingModal;

