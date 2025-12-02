import React, { useState, useEffect } from 'react';
import PageAccueil from './components/PageAccueil';
import PageAgriculteur from './components/PageAgriculteur';
import PageAcheteur from './components/PageAcheteur';
import PageMesAnnonces from './components/PageMesAnnonces';
import PageCommandes from './components/PageCommandes';
import PageCompte from './components/PageCompte';
import Navigation from './components/Navigation';
import UpdateAnnoncesButton from './components/UpdateAnnoncesButton';
import AuthModal from './components/AuthModal';
import { PRODUITS_SENEGAL, getProductImage } from './data/produits';
import { ANNONCES_DEMO } from './data/annonces';
import { addAnnonce, subscribeToAnnonces } from './services/firebaseService';
import firebaseAuth from './services/firebaseAuthService';

function App() {
  const [page, setPage] = useState('accueil');
  const [annonces, setAnnonces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProduit, setFilterProduit] = useState('');
  const [user, setUser] = useState(null);
  const [authVisible, setAuthVisible] = useState(false);

  // Charger les annonces depuis Firebase et s'abonner aux mises à jour en temps réel
  useEffect(() => {
    setLoading(true);
    let isMounted = true; // Flag pour vérifier si le composant est encore monté
    
    // Timeout de sécurité : si le chargement prend plus de 10 secondes, afficher les données de démo
    const timeoutId = setTimeout(() => {
      if (isMounted) {
        console.warn('⚠️ Timeout de chargement, utilisation des données de démo');
        setAnnonces(ANNONCES_DEMO);
        setLoading(false);
      }
    }, 10000);
    
    // S'abonner aux changements en temps réel
    const unsubscribe = subscribeToAnnonces((annoncesData) => {
      if (!isMounted) return; // Ne pas mettre à jour si le composant est démonté
      
      clearTimeout(timeoutId); // Annuler le timeout si les données arrivent
      
      try {
        if (annoncesData && annoncesData.length > 0) {
          // S'assurer que toutes les annonces ont les bonnes URLs d'images
          const annoncesAvecImages = annoncesData
            .filter(annonce => annonce && annonce.produit) // Filtrer les annonces invalides
            .map(annonce => {
              try {
                return {
                  ...annonce,
                  id: annonce.id || `temp_${Date.now()}_${Math.random()}`,
                  // Si l'image est manquante ou est un emoji, utiliser l'image du produit
                  image: annonce.image && annonce.image.length > 10 ? annonce.image : getProductImage(annonce.produit),
                  prix: typeof annonce.prix === 'number' ? annonce.prix : parseInt(annonce.prix) || 0,
                  quantite: typeof annonce.quantite === 'number' ? annonce.quantite : parseInt(annonce.quantite) || 0,
                  date: annonce.date || new Date().toISOString().split('T')[0]
                };
              } catch (e) {
                console.error('❌ Erreur lors du traitement d\'une annonce:', e, annonce);
                return null;
              }
            })
            .filter(annonce => annonce !== null); // Retirer les annonces null
          
          if (annoncesAvecImages.length > 0) {
            setAnnonces(annoncesAvecImages);
          } else {
            // Si toutes les annonces sont invalides, utiliser les données de démo
            setAnnonces(ANNONCES_DEMO);
          }
        } else {
          // Si aucune annonce dans Firebase, utiliser les données de démo
          setAnnonces(ANNONCES_DEMO);
        }
      } catch (error) {
        console.error('❌ Erreur lors du traitement des annonces:', error);
        // En cas d'erreur, utiliser les données de démo
        setAnnonces(ANNONCES_DEMO);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    });

    // Nettoyer l'abonnement et le timeout lors du démontage
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      unsubscribe();
    };
  }, []);

  // Suivre l'utilisateur courant
  useEffect(() => {
    const unsub = firebaseAuth.onAuthChange((u) => {
      setUser(u);
      if (page === 'login') {
        setPage('accueil');
      }
    });
    return () => unsub();
  }, [page]);

  // Formulaire agriculteur
  const [formData, setFormData] = useState({
    produit: '',
    quantite: '',
    unite: 'Sac',
    prix: '',
    telephone: '',
    regions: [], // Régions où le produit est disponible
    relayPoints: {} // Points de relais par région pour ce produit
  });
  const [uploading, setUploading] = useState(false);

  const handleSubmitAnnonce = async (paymentData = null) => {
    // Si paymentData est fourni, c'est que le paiement a été effectué
    if (!paymentData) {
      // Cette fonction ne devrait être appelée qu'après le paiement
      console.warn('handleSubmitAnnonce appelé sans données de paiement');
      return;
    }

    if (!formData.produit || !formData.quantite || !formData.prix || !formData.telephone) {
      alert('⚠️ Veuillez remplir tous les champs');
      return;
    }

    if (formData.telephone.length !== 9) {
      alert('⚠️ Le numéro doit contenir 9 chiffres');
      return;
    }

    // Les régions et points de relais sont maintenant optionnels
    // Si aucune région n'est sélectionnée, on utilisera des valeurs par défaut
    setUploading(true);

    try {
      // Utiliser l'image par défaut du produit
      const imageUrl = getProductImage(formData.produit);
      
      const currentUser = firebaseAuth.getCurrentUser();

      // Si aucune région n'est sélectionnée, ajouter des régions par défaut
      let regions = formData.regions || [];
      let relayPoints = formData.relayPoints || {};
      
      if (regions.length === 0) {
        // Ajouter des régions par défaut (Dakar, Thiès)
        regions = ['dakar', 'thies'];
        relayPoints = {
          'dakar': ['Marché Central de Dakar', 'Gare Routière de Dakar'],
          'thies': ['Gare Routière de Thiès', 'Marché de Thiès']
        };
      }

      const nouvelleAnnonce = {
        produit: formData.produit,
        image: imageUrl,
        quantite: parseInt(formData.quantite),
        unite: formData.unite,
        prix: parseInt(formData.prix),
        telephone: formData.telephone,
        date: new Date().toISOString().split('T')[0],
        regions: regions,
        relayPoints: relayPoints,
        createdBy: currentUser ? { uid: currentUser.uid, email: currentUser.email, displayName: currentUser.displayName } : null,
        // Ajouter les informations de paiement
        paymentTransactionId: paymentData.transactionId,
        paymentMethod: paymentData.paymentMethod,
        paidAt: paymentData.timestamp,
        publicationFee: 250 // Frais de publication
      };

      console.log('🔄 Publication de l\'annonce en cours...', nouvelleAnnonce);
      
      
      console.log('✅ Annonce publiée avec succès !');
      
      // Réinitialiser le formulaire
      setFormData({ produit: '', quantite: '', unite: 'Sac', prix: '', telephone: '', regions: [], relayPoints: {} });
      
      // Sauvegarder dans Firebase
      await addAnnonce(nouvelleAnnonce);

      alert('✅ Votre annonce a été publiée avec succès ! Elle est maintenant visible dans votre compte.');
      setPage('mesannonces');
    } catch (error) {
      console.error('❌ Erreur lors de la publication:', error);
      console.error('Détails complets:', {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      
      // Messages d'erreur plus détaillés
      let errorMessage = '❌ Erreur lors de la publication de l\'annonce.\n\n';
      
      if (error.code === 'permission-denied') {
        errorMessage += 'Erreur de permission.\n\n';
        errorMessage += 'Vérifiez que :\n';
        errorMessage += '1. Firestore est activé\n';
        errorMessage += '2. Les règles de sécurité permettent l\'écriture\n';
        errorMessage += '3. Vous êtes connecté à internet';
      } else if (error.code === 'unavailable') {
        errorMessage += 'Firebase n\'est pas disponible.\n\n';
        errorMessage += 'Vérifiez votre connexion internet.';
      } else if (error.message) {
        errorMessage += `Erreur: ${error.message}`;
      } else {
        errorMessage += 'Une erreur inconnue s\'est produite. Vérifiez la console pour plus de détails.';
      }
      
      alert(errorMessage);
    } finally {
      setUploading(false);
      console.log('🔄 État uploading réinitialisé');
    }
  };

  const handleSignOut = async () => {
    try {
      await firebaseAuth.signOut();
      setUser(null);
      setPage('accueil');
    } catch (error) {
      console.error('Erreur déconnexion', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100">
      <Navigation 
        user={user} 
        annonces={annonces}
        onNavigate={(page) => {
          if (page === 'login') {
            setAuthVisible(true);
          } else {
            setPage(page);
          }
        }}
        onSignOut={handleSignOut}
      />
      
      <div>
        {page === 'accueil' && <PageAccueil onNavigate={setPage} annonces={annonces} loading={loading} user={user} />}
        {page === 'agriculteur' && (
          <PageAgriculteur 
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmitAnnonce}
            onNavigate={setPage}
            uploading={uploading}
            annonces={annonces}
          />
        )}
        {page === 'acheteur' && (
          <PageAcheteur 
            annonces={annonces}
            loading={loading}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterProduit={filterProduit}
            setFilterProduit={setFilterProduit}
            onNavigate={setPage}
          />
        )}
        {page === 'mesannonces' && (
          <PageMesAnnonces
            annonces={annonces}
            user={user || firebaseAuth.getCurrentUser()}
            onNavigate={setPage}
          />
        )}
        {page === 'commandes' && (
          <PageCommandes onNavigate={setPage} />
        )}
        {page === 'compte' && (
          <PageCompte onNavigate={setPage} />
        )}
      </div>
      
      <AuthModal 
        visible={authVisible} 
        onClose={() => setAuthVisible(false)} 
        onAuthSuccess={(u) => {
          setUser(u);
          setAuthVisible(false);
        }} 
      />
      
      {/* Bouton de mise à jour des annonces (visible sur toutes les pages) */}
      <UpdateAnnoncesButton />
    </div>
  );
}

export default App;

