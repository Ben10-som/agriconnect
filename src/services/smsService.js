// Service d'envoi de SMS
// Pour la production, intégrer avec Twilio, Orange SMS API, ou un service SMS local

/**
 * Envoyer un SMS (simulation pour le moment)
 * Pour la production au Sénégal, vous pouvez utiliser:
 * - Twilio (international)
 * - Orange SMS API
 * - Un service SMS local
 */
export const sendSMS = async (phoneNumber, message) => {
  try {
    // Format du numéro: ajouter l'indicatif +221 pour le Sénégal
    const formattedPhone = phoneNumber.startsWith('+221') 
      ? phoneNumber 
      : `+221${phoneNumber}`;

    console.log(`📱 Envoi SMS à ${formattedPhone}: ${message}`);

    // TODO: Intégrer avec un service SMS réel
    // Exemple avec Twilio:
    // const accountSid = process.env.TWILIO_ACCOUNT_SID;
    // const authToken = process.env.TWILIO_AUTH_TOKEN;
    // const client = require('twilio')(accountSid, authToken);
    // 
    // await client.messages.create({
    //   body: message,
    //   from: TWILIO_PHONE_NUMBER,
    //   to: formattedPhone
    // });

    // Pour l'instant, simulation
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`✅ SMS envoyé (simulation) à ${formattedPhone}`);
        resolve({
          success: true,
          phoneNumber: formattedPhone,
          messageId: `SMS_${Date.now()}`,
          timestamp: new Date().toISOString()
        });
      }, 1000);
    });
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi du SMS:', error);
    throw error;
  }
};

/**
 * Envoyer une notification SMS pour une nouvelle commande
 */
export const sendOrderNotification = async (farmerPhone, orderDetails) => {
  const message = `Nouvelle commande IZZI\n\n` +
    `Produit: ${orderDetails.produit}\n` +
    `Quantité: ${orderDetails.quantite} ${orderDetails.unite}\n` +
    `Montant: ${orderDetails.total} FCFA\n` +
    `Acheteur: ${orderDetails.buyerName || 'Client'}\n` +
    `Point de relais: ${orderDetails.pickupLocation || 'À définir'}\n\n` +
    `Connectez-vous à IZZI pour valider la commande.`;

  return await sendSMS(farmerPhone, message);
};

/**
 * Envoyer une notification de validation de commande
 */
export const sendOrderValidation = async (buyerPhone, orderDetails) => {
  const message = `Votre commande a été validée!\n\n` +
    `Produit: ${orderDetails.produit}\n` +
    `Quantité: ${orderDetails.quantite} ${orderDetails.unite}\n` +
    `Montant: ${orderDetails.total} FCFA\n` +
    `Point de relais: ${orderDetails.pickupLocation}\n\n` +
    `Vous pouvez maintenant procéder au paiement sur IZZI.`;

  return await sendSMS(buyerPhone, message);
};

