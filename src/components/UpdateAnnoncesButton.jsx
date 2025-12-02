import React, { useState } from 'react';
import { addRegionsAndRelayPointsToExistingAnnonces } from '../services/firebaseService';

const UpdateAnnoncesButton = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleUpdate = async () => {
    if (!confirm('Voulez-vous ajouter des régions et points de relais fictifs à toutes les annonces existantes qui n\'en ont pas ?')) {
      return;
    }

    try {
      setLoading(true);
      setResult(null);
      
      const result = await addRegionsAndRelayPointsToExistingAnnonces();
      
      setResult({
        success: true,
        message: `✅ ${result.success} annonce(s) mise(s) à jour avec succès sur ${result.total} annonce(s) à traiter.`
      });
      
      alert(result.message);
    } catch (error) {
      console.error('Erreur:', error);
      setResult({
        success: false,
        message: '❌ Erreur lors de la mise à jour: ' + (error.message || 'Erreur inconnue')
      });
      alert('Erreur lors de la mise à jour: ' + (error.message || 'Erreur inconnue'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={handleUpdate}
        disabled={loading}
        className="bg-purple-600 text-white px-6 py-3 rounded-lg shadow-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {loading ? (
          <>
            <span className="animate-spin">⏳</span>
            Mise à jour en cours...
          </>
        ) : (
          <>
            🔄 Mettre à jour les annonces
          </>
        )}
      </button>
      {result && (
        <div className={`mt-2 p-3 rounded-lg text-sm ${
          result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {result.message}
        </div>
      )}
    </div>
  );
};

export default UpdateAnnoncesButton;

