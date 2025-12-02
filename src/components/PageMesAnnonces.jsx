import React, { useEffect } from 'react';
import { getProductImage } from '../data/produits';
import { Package, Calendar, DollarSign } from 'lucide-react';

const PageMesAnnonces = ({ annonces = [], user, onNavigate }) => {
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 text-center">
          <p className="text-gray-600 mb-4">Vous devez être connecté pour voir vos annonces.</p>
          <button
            onClick={() => onNavigate('accueil')}
            className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  // Filtrer les annonces de l'utilisateur avec plusieurs critères de correspondance
  const myAnnonces = annonces.filter(a => {
    if (!a || !user) return false;
    
    // Vérifier par UID (méthode principale)
    if (a.createdBy?.uid && user.uid && a.createdBy.uid === user.uid) {
      return true;
    }
    
    // Vérifier par email (méthode de secours)
    if (a.createdBy?.email && user.email && a.createdBy.email === user.email) {
      return true;
    }
    
    // Vérifier par téléphone (méthode de secours supplémentaire)
    if (a.telephone && user.phoneNumber && a.telephone === user.phoneNumber) {
      return true;
    }
    
    return false;
  });

  // Log pour déboguer
  useEffect(() => {
    if (user) {
      console.log('🔍 PageMesAnnonces - Débogage:', {
        totalAnnonces: annonces.length,
        myAnnoncesCount: myAnnonces.length,
        userUid: user.uid,
        userEmail: user.email,
        sampleAnnonce: annonces[0] ? {
          id: annonces[0].id,
          createdBy: annonces[0].createdBy,
          produit: annonces[0].produit
        } : null
      });
    }
  }, [annonces, user, myAnnonces.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <button 
            onClick={() => onNavigate('accueil')} 
            className="text-green-700 hover:text-green-900 flex items-center gap-2 font-medium"
          >
            ← Retour
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Package className="text-green-600" size={24} />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-800">Mes annonces</h2>
                <p className="text-gray-600 text-sm mt-1">Gérez toutes vos publications</p>
              </div>
            </div>
            {/* Compteur d'annonces */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-full shadow-lg">
              <div className="text-center">
                <div className="text-2xl font-bold">{myAnnonces.length}</div>
                <div className="text-xs font-medium">
                  {myAnnonces.length === 0 ? 'Aucune annonce' : 
                   myAnnonces.length === 1 ? 'Annonce publiée' : 
                   'Annonces publiées'}
                </div>
              </div>
            </div>
          </div>

          {myAnnonces.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucune annonce</h3>
              <p className="text-gray-500 mb-6">Vous n'avez pas encore publié d'annonce.</p>
              <button
                onClick={() => onNavigate('agriculteur')}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg"
              >
                Publier ma première annonce
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {myAnnonces.map(a => (
                <div key={a.id} className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden border border-gray-200">
                  <div className="h-40 overflow-hidden">
                    <img 
                      src={a.image || getProductImage(a.produit)} 
                      alt={a.produit} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg text-gray-800 mb-3">{a.produit}</h3>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Package size={16} className="text-green-600" />
                        <span>{a.quantite} {a.unite}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <DollarSign size={16} className="text-green-600" />
                        <span className="font-bold text-green-600">{a.prix.toLocaleString()} FCFA</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar size={14} />
                        <span>Publié le {new Date(a.date).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                    {a.paymentTransactionId && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          ✅ Payé ({a.publicationFee} FCFA)
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageMesAnnonces;
