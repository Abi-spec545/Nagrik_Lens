import React from 'react';
import { Terminal, BookOpen, Layers } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-700">NagrikLens Foundation</span>
            <span>•</span>
            <span>FastAPI + SQLite + React + Vite + Tailwind CSS</span>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-1.5 hover:text-slate-900 transition-colors">
              <BookOpen className="w-4 h-4 text-slate-400" />
              <span>docs/API_CONTRACT.md</span>
            </div>
            <div className="flex items-center space-x-1.5 hover:text-slate-900 transition-colors">
              <Layers className="w-4 h-4 text-slate-400" />
              <span>docs/ARCHITECTURE.md</span>
            </div>
            <div className="flex items-center space-x-1.5 hover:text-slate-900 transition-colors">
              <Terminal className="w-4 h-4 text-slate-400" />
              <span>GET /api/v1/health</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
