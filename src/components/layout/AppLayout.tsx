import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';
import { useApp } from '../../context/AppContext';

export const AppLayout: React.FC = () => {
  const { isDemoMode, setDemoMode } = useApp();

  return (
    <div className="flex h-screen overflow-hidden bg-navy-950 grid-bg">
      <div className="scan-line" />
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopHeader />
        {isDemoMode && (
          <div className="bg-purple-500/15 border-b border-purple-500/30 px-4 py-1.5 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
              <span className="text-purple-300 text-xs font-mono font-bold tracking-widest">DEMO MODE</span>
              <span className="text-slate-400 text-xs">— 2024 Gannon Storm scenario loaded. G4 storm, T−42 minutes, 8 critical substations.</span>
            </div>
            <button
              onClick={() => setDemoMode(false)}
              className="text-slate-400 hover:text-white text-xs font-mono"
            >
              EXIT DEMO
            </button>
          </div>
        )}
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
