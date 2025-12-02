import React from 'react';

const ConfirmModal = ({ visible, title = 'Confirmer', message = '', onConfirm, onCancel }) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm">
        <h3 className="font-bold text-lg mb-2">{title}</h3>
        <p className="text-sm text-gray-700 mb-4">{message}</p>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2 rounded border">Annuler</button>
          <button onClick={onConfirm} className="px-4 py-2 rounded bg-red-600 text-white">Se déconnecter</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
