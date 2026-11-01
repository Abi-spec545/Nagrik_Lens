import React from 'react';
import { LucideIcon } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

interface ModuleCardProps {
  title: string;
  codename: string;
  description: string;
  status: string;
  icon: LucideIcon;
  badgeLabel?: string;
  highlights: string[];
}

export const ModuleCard: React.FC<ModuleCardProps> = ({
  title,
  codename,
  description,
  status,
  icon: Icon,
  badgeLabel,
  highlights,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-800">
            <Icon className="w-6 h-6" />
          </div>
          <StatusBadge status={status} label={badgeLabel || status} size="sm" />
        </div>

        <div className="mb-3">
          <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">
            {codename}
          </div>
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        </div>

        <p className="text-sm text-slate-600 mb-4 leading-relaxed">
          {description}
        </p>

        <div className="space-y-1.5 pt-3 border-t border-slate-100">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">
            Planned Capabilities
          </div>
          {highlights.map((highlight, index) => (
            <div key={index} className="flex items-center text-xs text-slate-600">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mr-2 flex-shrink-0" />
              <span>{highlight}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="font-mono text-slate-400">/api/v1/{codename.toLowerCase()}</span>
        <span className="font-medium text-slate-500">Foundation Ready</span>
      </div>
    </div>
  );
};
