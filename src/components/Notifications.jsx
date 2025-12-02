import React, { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { subscribeToUnreadMessages } from '../services/messagingService';
import { subscribeToOrders } from '../services/firebaseService';
import firebaseAuth from '../services/firebaseAuthService';
import { getUserProfile } from '../services/firebaseService';

const Notifications = ({ onNavigate }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthChange(async (u) => {
      setUser(u);
      if (u) {
        const profile = await getUserProfile(u.uid);
        setUserProfile(profile);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const role = userProfile?.role || 'acheteur';
    const allNotifications = [];

    // Écouter les messages non lus
    const unsubscribeMessages = subscribeToUnreadMessages(user.uid, (messages) => {
      const messageNotifications = messages.map(msg => {
        let timestamp;
        try {
          timestamp = msg.createdAt?.toDate ? msg.createdAt.toDate() : 
                     msg.createdAt ? new Date(msg.createdAt) : new Date();
        } catch (e) {
          timestamp = new Date();
        }
        return {
          id: `msg_${msg.id}`,
          type: 'message',
          title: 'Nouveau message',
          message: `${msg.senderName || 'Utilisateur'}: ${(msg.message || '').substring(0, 50)}...`,
          timestamp: timestamp,
          orderId: msg.orderId,
          read: false
        };
      });

      // Mettre à jour les notifications
      setNotifications(prev => {
        const existing = prev.filter(n => n.type !== 'message');
        return [...existing, ...messageNotifications];
      });
    });

    // Écouter les nouvelles commandes (pour les agriculteurs)
    if (role === 'agriculteur') {
      const unsubscribeOrders = subscribeToOrders(user.uid, role, (orders) => {
        const newOrders = orders.filter(order => 
          order.status === 'pending' && !order.farmerValidated
        );

      const orderNotifications = newOrders.map(order => {
        let timestamp;
        try {
          timestamp = order.createdAt?.toDate ? order.createdAt.toDate() : 
                     order.createdAt ? new Date(order.createdAt) : new Date();
        } catch (e) {
          timestamp = new Date();
        }
        return {
          id: `order_${order.id}`,
          type: 'order',
          title: 'Nouvelle commande',
          message: `${order.produit || 'Produit'} - ${order.quantite || 0} ${order.unite || ''} - ${order.total || 0} FCFA`,
          timestamp: timestamp,
          orderId: order.id,
          read: false
        };
      });

        setNotifications(prev => {
          const existing = prev.filter(n => n.type !== 'order');
          return [...existing, ...orderNotifications];
        });
      });

      return () => {
        unsubscribeMessages();
        unsubscribeOrders();
      };
    }

    // Pour les acheteurs, écouter les validations de commande
    if (role === 'acheteur') {
      const unsubscribeOrders = subscribeToOrders(user.uid, role, (orders) => {
        const validatedOrders = orders.filter(order => 
          order.status === 'validated' && order.farmerValidated && !order.paid
        );

        const validationNotifications = validatedOrders.map(order => {
          let timestamp;
          try {
            timestamp = order.updatedAt?.toDate ? order.updatedAt.toDate() : 
                       order.updatedAt ? new Date(order.updatedAt) : new Date();
          } catch (e) {
            timestamp = new Date();
          }
          return {
            id: `validation_${order.id}`,
            type: 'validation',
            title: 'Commande validée',
            message: `Votre commande de ${order.produit || 'produit'} a été validée. Vous pouvez maintenant payer.`,
            timestamp: timestamp,
            orderId: order.id,
            read: false
          };
        });

        setNotifications(prev => {
          const existing = prev.filter(n => n.type !== 'validation');
          return [...existing, ...validationNotifications];
        });
      });

      return () => {
        unsubscribeMessages();
        unsubscribeOrders();
      };
    }

    return () => unsubscribeMessages();
  }, [user, userProfile]);

  // Calculer le nombre de notifications non lues
  useEffect(() => {
    const unread = notifications.filter(n => !n.read).length;
    setUnreadCount(unread);
  }, [notifications]);

  const handleNotificationClick = (notification) => {
    // Marquer comme lu
    setNotifications(prev =>
      prev.map(n =>
        n.id === notification.id ? { ...n, read: true } : n
      )
    );

    // Naviguer vers la page appropriée
    if (notification.orderId) {
      onNavigate('commandes');
    }
    setShowDropdown(false);
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const sortedNotifications = [...notifications].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 text-gray-700 hover:text-gray-900"
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowDropdown(false)}
          />
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-bold">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  Tout marquer comme lu
                </button>
              )}
            </div>

            {sortedNotifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                Aucune notification
              </div>
            ) : (
              <div className="divide-y">
                {sortedNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-4 cursor-pointer hover:bg-gray-50 ${
                      !notification.read ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-semibold text-sm">{notification.title}</div>
                        <div className="text-xs text-gray-600 mt-1">
                          {notification.message}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {(() => {
                            try {
                              const date = notification.timestamp?.toDate ? notification.timestamp.toDate() : 
                                          notification.timestamp instanceof Date ? notification.timestamp : 
                                          new Date(notification.timestamp);
                              return date.toLocaleString('fr-FR', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit'
                              });
                            } catch (e) {
                              return 'Date inconnue';
                            }
                          })()}
                        </div>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full ml-2" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Notifications;

