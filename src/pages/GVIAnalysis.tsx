import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, ArrowRight } from 'lucide-react';
import { substations } from '../data/substations';
import { RiskBadge } from '../components/ui/RiskBadge';
import { GVIIndicator } from '../components/ui/GVIIndicator';
import { motion } from 'framer-motion';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts';

const FACTORS = [
  { label: 'Storm Intensity', key: 'storm', description: 'Current storm severity (Kp, Bz, solar wind speed)', weight: '40%', max: 40 },
  { label: 'Latitude', key: 'lat', description: 'Geographic latitude — higher latitudes more susceptible', weight: '20%', max: 20 },
  { label: 'Transformer Age', key: 'age', description: 'Equipment age — older transformers less resilient', weight: '15%', max: 15 },
  { label: 'TX Exposure', key: 'tx', description: 'Length & orientation of transmission lines', weight: '15%', max: 15 },
  { label: 'Grid Loading', key: 'load', description: 'Current transformer load percentage', weight: '10%', max: 10 },
];

const radarData = FACTORS.map(f => ({ label: f.label, weight: parseFloat(f.weight) }));

export const GVIAnalysis: React.FC = () => {
  const navigate = useNavigate();
  const avgGVI = Math.round(substations.reduce((a, s) => a + s.gvi, 0) / substations.length);
  const maxGVI = Math.max(...substations.map(s => s.gvi));
  const critical = substations.filter(s => s.status === 'critical');
  const high = substations.filter(s => s.status === 'high');
  const moderate = substations.filter(s => s.status === 'moderate');
  const safe = substations.filter(s => s.status === 'safe');

  return (
    <div className="p-6 space-y-5">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="font-display font-bold text-2xl text-white">GVI ANALYSIS</h1>
          <span className="text-xs font-mono text-slate-500 border border-slate-700/50 px-2 py-0.5 rounded">GRID VULNERABILITY INDEX</span>
        </div>
        <p className="text-slate-500 text-xs font-mono mt-0.5">Composite risk scoring for India's power grid substations</p>
      </div>

      {/* GVI Hero */}
      <div className="grid md:grid-cols-3 gap-5">
        <div className="card p-5 text-center">
          <div className="text-[10px] font-mono text-slate-500 tracking-widest mb-3">OVERALL GRID RISK</div>
          <div className="flex justify-center mb-3">
            <GVIIndicator gvi={avgGVI} size="lg" animated />
          </div>
          <RiskBadge level={avgGVI > 75 ? 'critical' : avgGVI > 50 ? 'high' : 'moderate'} size="md" showDot />
          <div className="text-xs text-slate-500 mt-2 font-mono">Average across {substations.length} substations</div>
        </div>

        <div className="card p-5">
          <div className="text-[10px] font-mono text-slate-500 tracking-widest mb-3">DISTRIBUTION</div>
          <div className="space-y-3">
            {[
              { label: 'CRITICAL', count: critical.length, total: substations.length, color: 'bg-red-400', textColor: 'text-red-400' },
              { label: 'HIGH', count: high.length, total: substations.length, color: 'bg-orange-400', textColor: 'text-orange-400' },
              { label: 'MODERATE', count: moderate.length, total: substations.length, color: 'bg-yellow-400', textColor: 'text-yellow-400' },
              { label: 'SAFE', count: safe.length, total: substations.length, color: 'bg-green-400', textColor: 'text-green-400' },
            ].map(row => (
              <div key={row.label}>
                <div className="flex justify-between text-[10px] font-mono mb-1">
                  <span className={row.textColor}>{row.label}</span>
                  <span className="text-white font-bold">{row.count} <span className="text-slate-500">/ {row.total}</span></span>
                </div>
                <div className="h-1.5 bg-slate-700/50 rounded-full">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(row.count / row.total) * 100}%` }}
                    transition={{ duration: 1 }}
                    className={`h-full ${row.color} rounded-full`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <div className="text-[10px] font-mono text-slate-500 tracking-widest mb-3">GVI WEIGHT FACTORS</div>
          <ResponsiveContainer width="100%" height={160}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.06)" />
              <PolarAngleAxis dataKey="label" tick={{ fontSize: 8, fill: '#64748b', fontFamily: 'monospace' }} />
              <Radar name="Weight" dataKey="weight" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.15} strokeWidth={1.5} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* GVI Formula Explanation */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 size={14} className="text-cyan-400" />
          <span className="font-mono font-bold text-sm text-white">HOW GVI IS CALCULATED</span>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FACTORS.map((f, i) => (
            <motion.div
              key={f.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="p-3 rounded bg-slate-800/50 border border-slate-700/30"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono font-bold text-white">{f.label}</span>
                <span className="text-[10px] font-mono text-cyan-400 font-bold">{f.weight}</span>
              </div>
              <div className="text-[10px] text-slate-500 leading-relaxed">{f.description}</div>
              <div className="mt-1.5 text-[10px] font-mono text-slate-600">Max score: {f.max} pts</div>
            </motion.div>
          ))}
        </div>
        <div className="mt-4 p-3 rounded bg-cyan-500/5 border border-cyan-500/15">
          <div className="font-mono text-xs text-cyan-300">
            GVI = (Storm Intensity × 0.40) + (Latitude × 0.20) + (Transformer Age × 0.15) + (TX Exposure × 0.15) + (Grid Loading × 0.10)
          </div>
          <div className="text-[10px] text-slate-500 mt-1 font-mono">
            Range: 0 (no risk) → 100 (maximum risk) · Updates every 5 minutes during active storm conditions
          </div>
        </div>
      </div>

      {/* Critical substations list */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="font-mono font-bold text-sm text-white">CRITICAL SUBSTATIONS ({critical.length})</span>
          <button onClick={() => navigate('/substations')} className="text-xs text-cyan-400 font-mono flex items-center gap-1">
            ALL SUBSTATIONS <ArrowRight size={11} />
          </button>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          {substations.filter(s => s.status === 'critical').sort((a,b) => b.gvi - a.gvi).map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              className="flex items-center gap-3 p-3 rounded bg-red-500/5 border border-red-500/20 cursor-pointer hover:bg-red-500/10 transition-all"
              onClick={() => navigate(`/substations/${s.id}`)}
            >
              <GVIIndicator gvi={s.gvi} size="sm" showLabel={false} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white truncate">{s.name}</div>
                <div className="text-[10px] text-slate-500 font-mono">{s.city} · GIC: {s.estimatedGIC} A</div>
              </div>
              <ArrowRight size={13} className="text-slate-600 flex-shrink-0" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
