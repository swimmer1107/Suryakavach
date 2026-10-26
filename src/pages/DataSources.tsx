import React from 'react';
import { Database, ChevronRight, Activity, Clock, Zap } from 'lucide-react';
import { dataSources } from '../data/dataSources';
import { StatusBadge } from '../components/ui/StatusBadge';
import { motion } from 'framer-motion';

const STATUS_DOT: Record<string, string> = {
  live: 'bg-green-400',
  simulated: 'bg-cyan-400',
  historical: 'bg-amber-400',
  demo: 'bg-purple-400',
  offline: 'bg-red-400',
};

const PIPELINE_NODES = [
  { label: 'NOAA SWPC', color: '#22d3ee', type: 'source' },
  { label: 'NASA DSCOVR', color: '#22d3ee', type: 'source' },
  { label: 'ISRO Aditya-L1', color: '#a78bfa', type: 'source' },
  { label: 'Storm Archive', color: '#f59e0b', type: 'source' },
  { label: 'Grid Topology', color: '#f59e0b', type: 'source' },
  { label: 'DATA ENGINE', color: '#22d3ee', type: 'engine' },
  { label: 'ML PREDICTION', color: '#f97316', type: 'engine' },
  { label: 'GVI ENGINE', color: '#ef4444', type: 'engine' },
  { label: 'ALERT ENGINE', color: '#22c55e', type: 'engine' },
];

export const DataSources: React.FC = () => {
  return (
    <div className="p-6 space-y-5">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="font-display font-bold text-2xl text-white">DATA SOURCES</h1>
        </div>
        <p className="text-slate-500 text-xs font-mono mt-0.5">Data pipeline status · SuryaKavach ingestion layer</p>
      </div>

      {/* Pipeline visualization */}
      <div className="card p-5">
        <div className="font-mono font-bold text-sm text-white mb-5">DATA PIPELINE</div>
        <div className="space-y-3">
          {/* Sources row */}
          <div className="flex items-center gap-2 flex-wrap">
            {PIPELINE_NODES.filter(n => n.type === 'source').map(n => (
              <div key={n.label} className="px-3 py-1.5 rounded border border-slate-700/40 bg-slate-800/50 text-[10px] font-mono font-bold" style={{ color: n.color, borderColor: `${n.color}30` }}>
                {n.label}
              </div>
            ))}
          </div>
          {/* Arrow */}
          <div className="flex items-center gap-2 pl-2">
            <div className="flex flex-col items-center">
              <div className="w-px h-4 bg-cyan-500/30" />
              <div className="text-cyan-500/50">↓</div>
            </div>
            <span className="text-[10px] text-slate-600 font-mono">INGESTION · NORMALIZATION · VALIDATION</span>
          </div>
          {/* Engine row */}
          <div className="flex items-center gap-2 flex-wrap">
            {PIPELINE_NODES.filter(n => n.type === 'engine').map((n, i) => (
              <React.Fragment key={n.label}>
                <div className="px-3 py-1.5 rounded border text-[10px] font-mono font-bold flex items-center gap-1.5" style={{ color: n.color, borderColor: `${n.color}40`, background: `${n.color}10` }}>
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: n.color }} />
                  {n.label}
                </div>
                {i < 2 && <ChevronRight size={12} className="text-slate-600" />}
              </React.Fragment>
            ))}
          </div>
          {/* Arrow to output */}
          <div className="flex items-center gap-2 pl-2">
            <div className="flex flex-col items-center">
              <div className="w-px h-4 bg-green-500/30" />
              <div className="text-green-500/50">↓</div>
            </div>
            <span className="text-[10px] text-slate-600 font-mono">OUTPUT</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {['DASHBOARD', 'GRID MAP', 'ALERTS', 'OPERATOR NOTIFICATIONS'].map(o => (
              <div key={o} className="px-3 py-1.5 rounded border border-green-500/25 bg-green-500/8 text-[10px] font-mono text-green-400 font-bold">{o}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Data Source Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {dataSources.map((source, i) => (
          <motion.div
            key={source.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="card p-5"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-2 h-2 rounded-full ${STATUS_DOT[source.status]} animate-pulse`} />
                  <span className="font-mono font-bold text-sm text-white">{source.shortName}</span>
                </div>
                <div className="text-xs text-slate-400">{source.name}</div>
              </div>
              <StatusBadge status={source.status as any} size="sm" />
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed mb-4">{source.description}</p>

            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-2 rounded bg-slate-800/50">
                <div className="text-[9px] font-mono text-slate-600 mb-0.5">LATENCY</div>
                <div className="text-xs font-mono font-bold text-white">{source.latency} ms</div>
              </div>
              <div className="text-center p-2 rounded bg-slate-800/50">
                <div className="text-[9px] font-mono text-slate-600 mb-0.5">UPTIME</div>
                <div className="text-xs font-mono font-bold text-green-400">{source.uptime}%</div>
              </div>
              <div className="text-center p-2 rounded bg-slate-800/50">
                <div className="text-[9px] font-mono text-slate-600 mb-0.5">RECORDS</div>
                <div className="text-xs font-mono font-bold text-cyan-400">{source.recordsProcessed.toLocaleString()}</div>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-slate-600">
              <span className="flex items-center gap-1">
                <Clock size={10} /> Updated {Math.round((Date.now() - new Date(source.lastUpdated).getTime()) / 1000)}s ago
              </span>
              {source.endpoint && (
                <span className="text-slate-700 truncate max-w-[140px]">{source.endpoint}</span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Note */}
      <div className="p-4 rounded bg-amber-500/10 border border-amber-500/20">
        <div className="text-[10px] font-mono text-amber-400 font-bold tracking-wider mb-1">PROTOTYPE DISCLOSURE</div>
        <p className="text-xs text-slate-400 leading-relaxed">
          NOAA SWPC and NASA DSCOVR data feeds are real public APIs. ISRO Aditya-L1 integration is simulated in this prototype.
          Grid topology data is demo/prototype data — not official PGCIL or POSOCO records.
          The ML Prediction Engine is a physics-based simulation, not a trained ML model.
          All data marked SIMULATION or DEMO should not be used for operational decisions.
        </p>
      </div>
    </div>
  );
};
