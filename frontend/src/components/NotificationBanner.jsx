import React from 'react';
import { CheckCircle, ShieldCheck } from 'lucide-react';

export default function NotificationBanner({ notification }) {
  if (!notification?.message) return null;
  const bgColor = notification.type === 'success' ? 'bg-green-600/90' : 'bg-red-600/90';

  return (
    <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-xl text-white font-medium animate-fade-in flex items-center gap-2 ${bgColor}`}>
      {notification.type === 'success' ? <CheckCircle size={20} /> : <ShieldCheck size={20} />}
      {notification.message}
    </div>
  );
}
