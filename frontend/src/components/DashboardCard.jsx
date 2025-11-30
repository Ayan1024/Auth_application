import React from 'react';

export default function DashboardCard({ icon, label, value }) {
  return (
    <div className="glass-panel p-6 rounded-xl flex items-center gap-4 hover:bg-white/10 transition-colors group">
      <div className="p-3 rounded-lg bg-black/40 group-hover:scale-110 transition-transform">
        {React.cloneElement(icon, { size: 24 })}
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">{label}</p>
        <p className="text-lg text-white font-medium">{value}</p>
      </div>
    </div>
  );
}
