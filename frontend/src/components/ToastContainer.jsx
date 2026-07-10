import React from 'react';
import { useToast } from '../context/ToastContext';

export default function ToastContainer() {
  const { toasts } = useToast();
  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-50">
      {toasts.map((t) => (
        <div key={t.id} className={`px-4 py-2 rounded shadow ${t.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
          {t.message}
        </div>
      ))}
    </div>
  );
}
