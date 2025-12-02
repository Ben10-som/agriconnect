import React from 'react';
import { PRODUITS_SENEGAL } from '../data/produits';

// Composant de test pour vérifier les images
const ImageTest = () => {
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Test des images</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {PRODUITS_SENEGAL.map(produit => (
          <div key={produit.id} className="bg-white p-4 rounded shadow">
            <h3 className="font-bold mb-2">{produit.nom}</h3>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-gray-600">Locale:</p>
                <img 
                  src={produit.imageLocal} 
                  alt={`${produit.nom} local`}
                  className="w-24 h-24 object-cover border"
                  onError={(e) => {
                    console.error(`❌ Image locale non trouvée: ${produit.imageLocal}`);
                    e.target.style.border = '2px solid red';
                  }}
                  onLoad={() => {
                    console.log(`✅ Image locale chargée: ${produit.imageLocal}`);
                  }}
                />
                <p className="text-xs text-gray-500 mt-1">{produit.imageLocal}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Externe:</p>
                <img 
                  src={produit.image} 
                  alt={`${produit.nom} externe`}
                  className="w-24 h-24 object-cover border"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 p-4 bg-blue-50 rounded">
        <p className="font-bold">Instructions :</p>
        <ul className="list-disc list-inside text-sm mt-2">
          <li>Ouvrez la console (F12) pour voir les messages</li>
          <li>Les images avec bordure rouge n'ont pas été trouvées</li>
          <li>Vérifiez que les fichiers existent dans public/images/</li>
        </ul>
      </div>
    </div>
  );
};

export default ImageTest;





