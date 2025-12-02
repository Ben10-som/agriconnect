// Service de messagerie pour les conversations entre acheteur et agriculteur
import db from './firebaseService';
import { collection, addDoc, query, where, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';

const MESSAGES_COLLECTION = 'messages';

/**
 * Envoyer un message
 */
export const sendMessage = async (orderId, senderUid, senderName, message, recipientUid) => {
  try {
    if (!db) throw new Error('Firebase n\'est pas initialisé');
    
    const messageData = {
      orderId,
      senderUid,
      senderName,
      message,
      recipientUid,
      createdAt: Timestamp.now(),
      read: false
    };

    const docRef = await addDoc(collection(db, MESSAGES_COLLECTION), messageData);
    console.log('✅ Message envoyé, ID:', docRef.id);
    return { id: docRef.id, ...messageData };
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi du message:', error);
    throw error;
  }
};

/**
 * Écouter les messages d'une commande en temps réel
 */
export const subscribeToOrderMessages = (orderId, callback) => {
  try {
    if (!db) {
      callback([]);
      return () => {};
    }

    const messagesRef = collection(db, MESSAGES_COLLECTION);
    const q = query(
      messagesRef,
      where('orderId', '==', orderId),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messages = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        messages.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt)
        });
      });
      callback(messages);
    }, (error) => {
      console.error('❌ Erreur lors de l\'écoute des messages:', error);
      callback([]);
    });

    return unsubscribe;
  } catch (error) {
    console.error('❌ Erreur lors de la souscription aux messages:', error);
    callback([]);
    return () => {};
  }
};

/**
 * Écouter les messages non lus d'un utilisateur
 */
export const subscribeToUnreadMessages = (userId, callback) => {
  try {
    if (!db) {
      callback([]);
      return () => {};
    }

    const messagesRef = collection(db, MESSAGES_COLLECTION);
    const q = query(
      messagesRef,
      where('recipientUid', '==', userId),
      where('read', '==', false),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messages = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        messages.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt)
        });
      });
      callback(messages);
    }, (error) => {
      console.error('❌ Erreur lors de l\'écoute des messages non lus:', error);
      callback([]);
    });

    return unsubscribe;
  } catch (error) {
    console.error('❌ Erreur lors de la souscription aux messages non lus:', error);
    callback([]);
    return () => {};
  }
};

