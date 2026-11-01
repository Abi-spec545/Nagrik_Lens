import React from 'react';

interface StatusBadgeProps {
  status: 'healthy' | 'connected' | 'initialized' | 'degraded' | 'error' | 'loading' | string;
  label?: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label, size = 'md' }) => {
  const normalized = status.toLowerCase();

  let colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';
  let dotColor = 'bg-slate-400';

  if (['healthy', 'connected', 'ready', 'initialized'].includes(normalized)) {
    colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    dotColor = 'bg-emerald-500';
  } else if (['degraded', 'pending', 'loading'].includes(normalized)) {
    colorClasses = 'bg-amber-50 text-amber-700 border-amber-200';
    dotColor = 'bg-amber-500 animate-pulse';
  } else if (['error', 'failed', 'unreachable'].includes(normalized)) {
    colorClasses = 'bg-rose-50 text-rose-700 border-rose-200';
    dotColor = 'bg-rose-500';
  }

  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium border rounded-full ${padding} ${colorClasses}`}>
      <span className={`w-2 h-2 rounded-full ${dotColor}`} />
      <span className="capitalize">{label || status}</span>
    </span>
  );
};
