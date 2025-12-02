import React, { useEffect } from 'react';

const Toast = ({ visible, message, duration = 3000, onClose }) => {
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => {
      onClose && onClose();
    }, duration);
    return () => clearTimeout(t);
  }, [visible, duration, onClose]);

  if (!visible) return null;

  return (
    <div className="fixed right-4 bottom-6 z-50">
      <div className="bg-gray-900 text-white px-4 py-2 rounded shadow">{message}</div>
    </div>
  );
};

export default Toast;
