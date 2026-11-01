import React from 'react';
import { Compass, Activity, ShieldCheck } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

interface HeaderProps {
  apiStatus: string;
}

export const Header: React.FC<HeaderProps> = ({ apiStatus }) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-sm">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-xl text-slate-900 tracking-tight">NagrikLens</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                  v0.1.0
                </span>
              </div>
              <p className="text-xs text-slate-500">Civic Intelligence & Entitlement Discovery Platform</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-md border border-slate-200">
              <Activity className="w-4 h-4 text-slate-500" />
              <span>Backend API:</span>
              <StatusBadge status={apiStatus} size="sm" />
            </div>

            <div className="flex items-center space-x-1.5 text-xs text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-md border border-emerald-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="font-medium">48h Hackathon Build</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
