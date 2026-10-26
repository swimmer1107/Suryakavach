import React, { useState, useEffect } from 'react';
import { Activity, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { StatusBadge } from '../components/ui/StatusBadge';
import { useApp } from '../context/AppContext';
import { solarWindData, bzData, kpData, densityData, xrayData, cmeVelocityData } from '../data/stormData';
import {
  ResponsiveContainer, AreaChart, Area, LineChart, Line,
  XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine
} from 'recharts';

type TimeRange = '1H' | '6H' | '12H' | '24H';

const RANGE_POINTS: Record<TimeRange, number> = { '1H': 4, '6H': 12, '12H': 24, '24H': 48 };

const CustomTooltip = ({ active, payload, label, unit }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-navy-800 border border-slate-700/50 rounded px-3 py-2 text-xs font-mono">
      <div className="text-slate-400 mb-1">{label}</div>
      <div className="text-cyan-400 font-bold">{payload[0]?.value?.toFixed(2)} {unit}</div>
    </div>
  );
};

interface ChartBlockProps {
  title: string;
  subtitle: string;
  data: { time: string; value: number }[];
  color: string;
  unit: string;
  isCritical?: boolean;
  invertFill?: boolean;
  referenceValue?: number;
  referenceLabel?: string;
  currentValue: string;
  trend: 'up' | 'down' | 'stable';
}

const ChartBlock: React.FC<ChartBlockProps> = ({
  title, subtitle, data, color, unit, isCritical, invertFill, referenceValue, referenceLabel, currentValue, trend
}) => (
  <div className={`card p-4 ${isCritical ? 'border-red-500/20 bg-red-500/3' : ''}`}>
    <div className="flex items-start justify-between mb-3">
      <div>
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold text-sm text-white">{title}</span>
          {isCritical && <span className="text-[9px] font-mono text-red-400 font-bold border border-red-500/30 px-1 py-0.5 rounded">CRITICAL</span>}
        </div>
        <div className="text-[10px] text-slate-500 mt-0.5">{subtitle}</div>
      </div>
      <div className="text-right">
        <div className={`font-mono font-bold text-xl`} style={{ color }}>{currentValue}</div>
        <div className="text-[10px] text-slate-500 font-mono flex items-center justify-end gap-1">
          {trend === 'up' ? <TrendingUp size={10} className="text-red-400" /> : trend === 'down' ? <TrendingDown size={10} className="text-red-400" /> : null}
          {unit}
        </div>
      </div>
    </div>
    <ResponsiveContainer width="100%" height={100}>
      <AreaChart data={data} margin={{ top: 4, right: 0, left: -30, bottom: 0 }}>
        <defs>
          <linearGradient id={`grad-${title}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.25} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
        <XAxis dataKey="time" tick={{ fontSize: 8, fill: '#475569', fontFamily: 'monospace' }} interval="preserveStartEnd" />
        <YAxis tick={{ fontSize: 8, fill: '#475569', fontFamily: 'monospace' }} />
        <Tooltip content={<CustomTooltip unit={unit} />} />
        {referenceValue !== undefined && (
          <ReferenceLine y={referenceValue} stroke="rgba(239,68,68,0.5)" strokeDasharray="4 4" label={{ value: referenceLabel, fill: '#ef4444', fontSize: 9, fontFamily: 'monospace' }} />
        )}
        <Area
          type="monotone" dataKey="value"
          stroke={color} strokeWidth={1.5}
          fill={`url(#grad-${title})`}
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

export const StormIntelligence: React.FC = () => {
  const { storm } = useApp();
  const [timeRange, setTimeRange] = useState<TimeRange>('12H');
  const [liveWind, setLiveWind] = useState(storm.solarWindSpeed);
  const [liveBz, setLiveBz] = useState(storm.bz);

  useEffect(() => {
    const t = setInterval(() => {
      setLiveWind(v => v + (Math.random() - 0.4) * 12);
      setLiveBz(v => v - (Math.random() * 0.8));
    }, 2500);
    return () => clearInterval(t);
  }, []);

  const n = RANGE_POINTS[timeRange];
  const slicedWind = solarWindData.slice(-n);
  const slicedBz = bzData.slice(-n);
  const slicedKp = kpData.slice(-n);
  const slicedDensity = densityData.slice(-n);
  const slicedXray = xrayData.slice(-n);
  const slicedCme = cmeVelocityData.slice(-Math.floor(n / 2));

  const storySeveritySteps = [
    { kp: '< 5', label: 'Minor (G1–G2)', color: 'text-green-400' },
    { kp: '5–6', label: 'Moderate (G3)', color: 'text-yellow-400' },
    { kp: '6–7', label: 'Strong (G3)', color: 'text-orange-400' },
    { kp: '7–9', label: 'Severe (G4)', color: 'text-red-400' },
    { kp: '≥ 9', label: 'Extreme (G5)', color: 'text-red-600' },
  ];

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display font-bold text-2xl text-white">STORM INTELLIGENCE</h1>
            <StatusBadge status="live" size="md" />
          </div>
          <p className="text-slate-500 text-xs font-mono mt-0.5">Real-time solar wind, Bz, CME and geomagnetic parameters</p>
        </div>
        <div className="flex items-center gap-1 bg-navy-800 border border-slate-700/50 rounded p-1">
          {(['1H', '6H', '12H', '24H'] as TimeRange[]).map(r => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all ${timeRange === r ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-slate-500 hover:text-white'}`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Current Conditions Banner */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {[
          { label: 'SOLAR WIND', val: `${liveWind.toFixed(0)}`, unit: 'km/s', color: '#22d3ee' },
          { label: 'Bz', val: liveBz.toFixed(1), unit: 'nT', color: '#ef4444', warn: liveBz < -15 },
          { label: 'Kp INDEX', val: storm.kp.toFixed(1), unit: '', color: '#f97316' },
          { label: 'DENSITY', val: storm.density.toFixed(1), unit: 'p/cm³', color: '#eab308' },
          { label: 'X-RAY', val: storm.xrayFlux, unit: '', color: '#a855f7' },
          { label: 'CME VEL.', val: storm.cmeVelocity.toString(), unit: 'km/s', color: '#fb923c' },
        ].map(m => (
          <div key={m.label} className={`card p-3 ${m.warn ? 'border-red-500/30 bg-red-500/5' : ''}`}>
            <div className="text-[9px] font-mono text-slate-500 tracking-widest mb-1.5">{m.label}</div>
            <div className="font-mono font-bold text-lg" style={{ color: m.color }}>{m.val}</div>
            <div className="text-[9px] text-slate-600 font-mono">{m.unit || '\u00A0'}</div>
            {m.warn && <div className="text-[9px] text-red-400 font-mono font-bold mt-1">⚠ SOUTHWARD</div>}
          </div>
        ))}
      </div>

      {/* Bz critical note */}
      <div className="p-3 rounded bg-red-500/10 border border-red-500/25 flex items-start gap-3">
        <AlertTriangle size={14} className="text-red-400 mt-0.5 flex-shrink-0" />
        <div>
          <span className="text-red-300 font-mono font-bold text-xs">WHY Bz MATTERS: </span>
          <span className="text-slate-400 text-xs">
            The Bz component (north-south direction of interplanetary magnetic field) is the primary trigger for geomagnetic storms.
            Southward Bz (negative) connects with Earth's northward field, enabling energy transfer into the magnetosphere.
            Strong sustained southward Bz drives GICs in power transmission lines.
          </span>
        </div>
      </div>

      {/* Charts grid */}
      <div className="grid md:grid-cols-2 gap-4">
        <ChartBlock
          title="SOLAR WIND SPEED"
          subtitle="Particle velocity at L1 point"
          data={slicedWind}
          color="#22d3ee"
          unit="km/s"
          currentValue={`${liveWind.toFixed(0)}`}
          trend="up"
          referenceValue={500}
          referenceLabel="ALERT"
        />
        <ChartBlock
          title="Bz COMPONENT"
          subtitle="Interplanetary magnetic field — southward is critical"
          data={slicedBz}
          color="#ef4444"
          unit="nT"
          isCritical
          currentValue={liveBz.toFixed(1)}
          trend="down"
          referenceValue={-10}
          referenceLabel="STORM"
        />
        <ChartBlock
          title="Kp INDEX"
          subtitle="Global geomagnetic activity index (0–9)"
          data={slicedKp}
          color="#f97316"
          unit=""
          currentValue={storm.kp.toFixed(1)}
          trend="up"
          referenceValue={5}
          referenceLabel="G1"
        />
        <ChartBlock
          title="SOLAR WIND DENSITY"
          subtitle="Particle density at L1 (particles/cm³)"
          data={slicedDensity}
          color="#eab308"
          unit="p/cm³"
          currentValue={storm.density.toFixed(1)}
          trend="up"
        />
        <ChartBlock
          title="X-RAY FLUX"
          subtitle="Solar X-ray emission (GOES satellite)"
          data={slicedXray}
          color="#a855f7"
          unit="W/m²"
          currentValue={storm.xrayFlux}
          trend="up"
        />
        <ChartBlock
          title="CME VELOCITY"
          subtitle="Coronal mass ejection propagation speed"
          data={slicedCme}
          color="#fb923c"
          unit="km/s"
          currentValue={`${storm.cmeVelocity}`}
          trend="up"
          referenceValue={1000}
          referenceLabel="HIGH"
        />
      </div>

      {/* Severity Scale */}
      <div className="card p-5">
        <div className="font-mono font-bold text-sm text-white mb-4">STORM SEVERITY SCALE — CURRENT: <span className="text-red-400">{storm.severity} (Kp {storm.kp.toFixed(1)})</span></div>
        <div className="flex gap-3 flex-wrap">
          {storySeveritySteps.map(s => (
            <div key={s.kp} className={`flex-1 min-w-[100px] p-3 rounded border ${s.label.includes('G4') ? 'border-red-500/40 bg-red-500/10' : 'border-slate-700/40'}`}>
              <div className={`font-mono font-bold text-sm ${s.color}`}>Kp {s.kp}</div>
              <div className="text-xs text-slate-400 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
