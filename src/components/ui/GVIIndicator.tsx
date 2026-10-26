import React from 'react';
import { getRiskFromGVI, RISK_CONFIG } from './RiskBadge';

interface GVIIndicatorProps {
  gvi: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animated?: boolean;
}

export const GVIIndicator: React.FC<GVIIndicatorProps> = ({ gvi, size = 'md', showLabel = true, animated = false }) => {
  const risk = getRiskFromGVI(gvi);
  const config = RISK_CONFIG[risk];
  
  const radius = size === 'sm' ? 28 : size === 'md' ? 40 : 56;
  const strokeWidth = size === 'sm' ? 4 : size === 'md' ? 5 : 7;
  const circumference = 2 * Math.PI * radius;
  const progress = (gvi / 100) * circumference;
  
  const strokeColor = risk === 'critical' ? '#ef4444' 
    : risk === 'high' ? '#f97316' 
    : risk === 'moderate' ? '#eab308' 
    : '#22c55e';

  const svgSize = (radius + strokeWidth + 4) * 2;
  const center = svgSize / 2;
  const fontSize = size === 'sm' ? '14' : size === 'md' ? '18' : '28';
  const labelFontSize = size === 'sm' ? '7' : size === 'md' ? '9' : '12';

  return (
    <div className="relative inline-flex flex-col items-center">
      <svg width={svgSize} height={svgSize} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={center} cy={center} r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={center} cy={center} r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={`${progress} ${circumference}`}
          strokeLinecap="round"
          style={{
            filter: `drop-shadow(0 0 6px ${strokeColor}80)`,
            transition: animated ? 'stroke-dasharray 1s ease-in-out' : undefined,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`font-mono font-bold ${config.textClass}`} style={{ fontSize: `${fontSize}px`, lineHeight: 1 }}>
          {gvi}
        </span>
        {showLabel && (
          <span className="text-slate-500 font-mono" style={{ fontSize: `${labelFontSize}px` }}>GVI</span>
        )}
      </div>
    </div>
  );
};
