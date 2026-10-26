import React from 'react';

interface SparklineChartProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  fillColor?: string;
}

export const SparklineChart: React.FC<SparklineChartProps> = ({
  data, width = 80, height = 28, color = '#22d3ee', fillColor
}) => {
  if (!data || data.length < 2) return null;
  
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  
  const points = data.map((v, i) => ({
    x: (i / (data.length - 1)) * width,
    y: height - ((v - min) / range) * (height - 4) - 2,
  }));
  
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const fillPath = fillColor ? `${pathD} L ${width} ${height} L 0 ${height} Z` : '';
  
  return (
    <svg width={width} height={height} style={{ overflow: 'visible' }}>
      {fillColor && <path d={fillPath} fill={fillColor} />}
      <path d={pathD} stroke={color} strokeWidth={1.5} fill="none" strokeLinecap="round" />
      <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r={2} fill={color} />
    </svg>
  );
};
