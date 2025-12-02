import React from 'react';
import { ShoppingCart, Phone, Search, Filter } from 'lucide-react';
import { PRODUITS_SENEGAL, getProductImage } from '../data/produits';

const PageAcheteur = ({ annonces, loading, searchTerm, setSearchTerm, filterProduit, setFilterProduit, onNavigate }) => {
  // S'assurer que toutes les annonces ont les bonnes URLs d'images
  const annoncesAvecImages = annonces.map(annonce => ({
    ...annonce,
    image: annonce.image || getProductImage(annonce.produit)
  }));

  const annoncesFiltrees = annoncesAvecImages.filter(a => {
    const matchSearch = a.produit.toLowerCase().includes(searchTerm.toLowerCase());
    const matchFilter = !filterProduit || a.produit === filterProduit;
    return matchSearch && matchFilter;
  });

  return (
    <div className="min-h-screen bg-blue-50 p-4">
      <div className="max-w-6xl mx-auto pt-6">
        <button 
          onClick={() => onNavigate('accueil')}
          className="mb-6 text-blue-700 hover:text-blue-900 flex items-center gap-2"
        >
          ← Retour
        </button>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold text-blue-800">Produits disponibles</h2>
              {loading ? (
                <p className="text-gray-500">Chargement des produits...</p>
              ) : (
                <p className="text-gray-600">{annoncesFiltrees.length} annonce(s) trouvée(s)</p>
              )}
            </div>
            <ShoppingCart className="text-blue-600" size={40} />
          </div>

          {/* Filtres */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-3.5 text-gray-400" size={20} />
              <select
                value={filterProduit}
                onChange={(e) => setFilterProduit(e.target.value)}
                className="w-full pl-10 p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              >
                <option value="">Tous les produits</option>
                {PRODUITS_SENEGAL.map(p => (
                  <option key={p.id} value={p.nom}>{p.nom}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Liste des annonces */}
        {loading ? (
          <div className="text-center py-12 bg-white rounded-xl">
            <div className="text-5xl mb-4 animate-spin">⏳</div>
            <p className="text-xl text-gray-600">Chargement des produits...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {annoncesFiltrees.map(annonce => (
            <div key={annonce.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden">
              <div className="h-48 w-full overflow-hidden bg-gray-100">
                <img 
                  src={annonce.image} 
                  alt={annonce.produit}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    // Fallback si l'image locale ne charge pas, utiliser l'image externe
                    const fallbackImage = "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=400&h=400&fit=crop";
                    if (e.target.src !== fallbackImage) {
                      console.warn(`Image non trouvée: ${annonce.image}, utilisation du fallback`);
                      e.target.src = fallbackImage;
                    }
                  }}
                />
              </div>
              
              <div className="p-5">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{annonce.produit}</h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Quantité:</span>
                    <span className="font-semibold text-lg">{annonce.quantite} {annonce.unite}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Prix:</span>
                    <span className="font-bold text-xl text-green-600">{annonce.prix.toLocaleString()} FCFA</span>
                  </div>

                  <div className="text-sm text-gray-500 pt-2 border-t">
                    Publié le {new Date(annonce.date).toLocaleDateString('fr-FR')}
                  </div>
                </div>

                <a
                  href={`tel:+221${annonce.telephone}`}
                  className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg font-bold hover:bg-blue-700 transition"
                >
                  <Phone className="inline mr-2" size={18} />
                  Appeler le vendeur
                </a>
              </div>
            </div>
          ))}
          </div>
        )}

        {!loading && annoncesFiltrees.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-xl text-gray-600">Aucun produit trouvé</p>
            <p className="text-gray-500 mt-2">Essayez de modifier vos filtres</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PageAcheteur;

