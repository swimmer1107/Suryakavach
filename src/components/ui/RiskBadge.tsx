import React from 'react';
import type { RiskLevel } from '../../types';

interface RiskBadgeProps {
  level: RiskLevel | string;
  gvi?: number;
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
}

export const RISK_CONFIG = {
  critical: {
    label: 'CRITICAL',
    className: 'bg-red-500/20 text-red-400 border border-red-500/40',
    dotClass: 'bg-red-400',
    glow: 'shadow-[0_0_12px_rgba(248,113,113,0.4)]',
    textClass: 'text-red-400',
  },
  high: {
    label: 'HIGH',
    className: 'bg-orange-500/20 text-orange-400 border border-orange-500/40',
    dotClass: 'bg-orange-400',
    glow: 'shadow-[0_0_12px_rgba(251,146,60,0.4)]',
    textClass: 'text-orange-400',
  },
  moderate: {
    label: 'MODERATE',
    className: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40',
    dotClass: 'bg-yellow-400',
    glow: '',
    textClass: 'text-yellow-400',
  },
  safe: {
    label: 'SAFE',
    className: 'bg-green-500/20 text-green-400 border border-green-500/40',
    dotClass: 'bg-green-400',
    glow: '',
    textClass: 'text-green-400',
  },
};

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, gvi, size = 'sm', showDot = false }) => {
  const config = RISK_CONFIG[level as RiskLevel] || RISK_CONFIG.safe;
  const sizeClass = size === 'sm' ? 'text-[10px] px-1.5 py-0.5' 
    : size === 'md' ? 'text-xs px-2 py-1' 
    : 'text-sm px-3 py-1.5';

  return (
    <span className={`inline-flex items-center gap-1.5 font-mono font-bold tracking-widest rounded ${sizeClass} ${config.className}`}>
      {showDot && <span className={`w-1.5 h-1.5 rounded-full ${config.dotClass} animate-pulse`} />}
      {gvi !== undefined ? `${config.label} ${gvi}` : config.label}
    </span>
  );
};

export const getRiskColor = (level: string): string => {
  return RISK_CONFIG[level as RiskLevel]?.textClass || 'text-slate-400';
};

export const getRiskFromGVI = (gvi: number): RiskLevel => {
  if (gvi >= 76) return 'critical';
  if (gvi >= 51) return 'high';
  if (gvi >= 26) return 'moderate';
  return 'safe';
};
