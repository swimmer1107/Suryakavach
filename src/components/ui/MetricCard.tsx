import React from 'react';
import { motion } from 'framer-motion';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  color?: 'cyan' | 'red' | 'orange' | 'yellow' | 'green' | 'white';
  badge?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const COLOR_MAP = {
  cyan: 'text-cyan-400',
  red: 'text-red-400',
  orange: 'text-orange-400',
  yellow: 'text-yellow-400',
  green: 'text-green-400',
  white: 'text-white',
};

export const MetricCard: React.FC<MetricCardProps> = ({
  title, value, unit, subtitle, trend, trendValue, color = 'white', badge, children, className = '', onClick
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`card p-4 ${onClick ? 'cursor-pointer hover:border-cyan-500/30 transition-all' : ''} ${className}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs font-mono text-slate-400 tracking-widest uppercase">{title}</span>
        {badge}
      </div>
      <div className="flex items-end gap-2">
        <span className={`font-mono text-2xl font-bold ${COLOR_MAP[color]}`}>{value}</span>
        {unit && <span className="text-slate-400 text-sm mb-0.5 font-mono">{unit}</span>}
        {trend && (
          <span className={`text-xs font-mono mb-1 ${trend === 'up' ? 'text-red-400' : trend === 'down' ? 'text-green-400' : 'text-slate-400'}`}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
          </span>
        )}
      </div>
      {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
      {children}
    </motion.div>
  );
};
