import React from 'react';
import type { DataSourceStatus } from '../../types';

interface StatusBadgeProps {
  status: DataSourceStatus | 'live' | 'operational' | 'degraded' | 'offline' | 'simulation' | 'demo' | 'replay' | 'historical';
  size?: 'sm' | 'md';
}

const STATUS_CONFIG = {
  live: { label: 'LIVE', className: 'bg-green-500/20 text-green-400 border border-green-500/40' },
  operational: { label: 'OPERATIONAL', className: 'bg-green-500/20 text-green-400 border border-green-500/40' },
  simulation: { label: 'SIMULATION', className: 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' },
  simulated: { label: 'SIMULATED', className: 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' },
  demo: { label: 'DEMO', className: 'bg-purple-500/20 text-purple-400 border border-purple-500/40' },
  replay: { label: 'REPLAY', className: 'bg-blue-500/20 text-blue-400 border border-blue-500/40' },
  historical: { label: 'HISTORICAL', className: 'bg-amber-500/20 text-amber-400 border border-amber-500/40' },
  degraded: { label: 'DEGRADED', className: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40' },
  offline: { label: 'OFFLINE', className: 'bg-red-500/20 text-red-400 border border-red-500/40' },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm' }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.live;
  const sizeClass = size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-1';
  
  return (
    <span className={`inline-flex items-center gap-1 font-mono font-semibold tracking-widest rounded ${sizeClass} ${config.className}`}>
      {(status === 'live' || status === 'operational') && (
        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
      )}
      {config.label}
    </span>
  );
};
