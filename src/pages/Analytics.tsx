import React from 'react';
import { TrendingUp, Activity, BarChart3, Clock } from 'lucide-react';
import { StatusBadge } from '../components/ui/StatusBadge';
import { substations } from '../data/substations';
import { historicalStorms } from '../data/stormData';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';

const GVI_DIST = [
  { range: '0–10', count: 0 },
  { range: '11–25', count: substations.filter(s => s.gvi >= 11 && s.gvi <= 25).length },
  { range: '26–40', count: substations.filter(s => s.gvi >= 26 && s.gvi <= 40).length },
  { range: '41–55', count: substations.filter(s => s.gvi >= 41 && s.gvi <= 55).length },
  { range: '56–70', count: substations.filter(s => s.gvi >= 56 && s.gvi <= 70).length },
  { range: '71–85', count: substations.filter(s => s.gvi >= 71 && s.gvi <= 85).length },
  { range: '86–100', count: substations.filter(s => s.gvi > 85).length },
];

const KP_HISTORY = [
  { month: 'Nov', kp: 2.1 }, { month: 'Dec', kp: 3.4 }, { month: 'Jan', kp: 2.8 },
  { month: 'Feb', kp: 4.2 }, { month: 'Mar', kp: 3.1 }, { month: 'Apr', kp: 1.9 },
  { month: 'May', kp: 8.1 }, { month: 'Jun', kp: 3.7 }, { month: 'Jul', kp: 2.4 },
  { month: 'Aug', kp: 4.8 }, { month: 'Sep', kp: 3.2 }, { month: 'Oct', kp: 7.2 },
];

const WARNING_LEAD = [
  { storm: 'Gannon 2024', lead: 42, baseline: 8 },
  { storm: 'Oct 2024', lead: 38, baseline: 8 },
  { storm: 'Aug 2024', lead: 51, baseline: 8 },
  { storm: 'Jun 2024', lead: 45, baseline: 8 },
  { storm: 'Mar 2024', lead: 37, baseline: 8 },
];

const RISK_PIE = [
  { name: 'Critical', value: substations.filter(s=>s.status==='critical').length, color: '#ef4444' },
  { name: 'High', value: substations.filter(s=>s.status==='high').length, color: '#f97316' },
  { name: 'Moderate', value: substations.filter(s=>s.status==='moderate').length, color: '#eab308' },
  { name: 'Safe', value: substations.filter(s=>s.status==='safe').length, color: '#22c55e' },
];

const TT = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-navy-800 border border-slate-700/50 rounded px-3 py-2 text-xs font-mono">
      <div className="text-slate-400 mb-1">{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} style={{ color: p.color }}>{p.name}: {p.value}</div>
      ))}
    </div>
  );
};

export const Analytics: React.FC = () => {
  return (
    <div className="p-6 space-y-5">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="font-display font-bold text-2xl text-white">ANALYTICS</h1>
          <StatusBadge status="historical" size="md" />
        </div>
        <p className="text-slate-500 text-xs font-mono mt-0.5">Historical storm data · Prototype dataset · Not official records</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'STORMS ANALYZED', val: '12', color: 'text-cyan-400', icon: <Activity size={14} /> },
          { label: 'AVG WARNING TIME', val: '43 min', color: 'text-green-400', icon: <Clock size={14} /> },
          { label: 'HIGHEST GVI', val: '96', color: 'text-red-400', icon: <TrendingUp size={14} /> },
          { label: 'SUBSTATIONS', val: '1,247', color: 'text-white', icon: <BarChart3 size={14} /> },
        ].map(s => (
          <div key={s.label} className="card p-4">
            <div className="flex items-center gap-1.5 mb-2 text-slate-500">{s.icon}<span className="text-[10px] font-mono tracking-widest">{s.label}</span></div>
            <div className={`font-mono font-bold text-2xl ${s.color}`}>{s.val}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {/* Kp history */}
        <div className="card p-5">
          <div className="font-mono font-bold text-sm text-white mb-4">MONTHLY Kp INDEX — 2024–2025</div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={KP_HISTORY} margin={{ top: 4, right: 0, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="kpA" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fontSize: 9, fill: '#475569', fontFamily: 'monospace' }} />
              <YAxis tick={{ fontSize: 9, fill: '#475569', fontFamily: 'monospace' }} domain={[0, 10]} />
              <Tooltip content={<TT />} />
              <Area type="monotone" dataKey="kp" stroke="#f97316" strokeWidth={2} fill="url(#kpA)" name="Kp" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* GVI distribution */}
        <div className="card p-5">
          <div className="font-mono font-bold text-sm text-white mb-4">GVI DISTRIBUTION — ALL SUBSTATIONS</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={GVI_DIST} margin={{ top: 4, right: 0, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="range" tick={{ fontSize: 9, fill: '#475569', fontFamily: 'monospace' }} />
              <YAxis tick={{ fontSize: 9, fill: '#475569', fontFamily: 'monospace' }} />
              <Tooltip content={<TT />} />
              <Bar dataKey="count" name="Substations" radius={[3, 3, 0, 0]}>
                {GVI_DIST.map((entry, i) => (
                  <Cell key={i} fill={
                    entry.range.startsWith('7') || entry.range.startsWith('8') || entry.range.startsWith('86') ? '#ef4444' :
                    entry.range.startsWith('5') || entry.range.startsWith('6') ? '#f97316' :
                    entry.range.startsWith('4') || entry.range.startsWith('3') ? '#eab308' : '#22c55e'
                  } />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Warning lead time */}
        <div className="card p-5">
          <div className="font-mono font-bold text-sm text-white mb-4">WARNING LEAD TIME — SuryaKavach vs Baseline</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={WARNING_LEAD} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis type="number" tick={{ fontSize: 9, fill: '#475569', fontFamily: 'monospace' }} unit=" min" />
              <YAxis type="category" dataKey="storm" tick={{ fontSize: 9, fill: '#475569', fontFamily: 'monospace' }} width={80} />
              <Tooltip content={<TT />} />
              <Bar dataKey="baseline" name="Industry Baseline" fill="#374151" radius={[0, 3, 3, 0]} />
              <Bar dataKey="lead" name="SuryaKavach" fill="#22d3ee" radius={[0, 3, 3, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Pie */}
        <div className="card p-5">
          <div className="font-mono font-bold text-sm text-white mb-4">CURRENT RISK DISTRIBUTION</div>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie data={RISK_PIE} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                  {RISK_PIE.map((entry, i) => (
                    <Cell key={i} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {RISK_PIE.map(item => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: item.color }} />
                    <span className="text-xs font-mono text-slate-400">{item.name}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-white">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Historical Storms Reference */}
      <div className="card p-5">
        <div className="font-mono font-bold text-sm text-white mb-4">HISTORICAL STORM REFERENCE</div>
        <div className="space-y-3">
          {historicalStorms.map(storm => (
            <div key={storm.id} className="p-4 rounded bg-slate-800/40 border border-slate-700/30 grid md:grid-cols-4 gap-4">
              <div>
                <div className="text-sm font-medium text-white">{storm.name}</div>
                <div className="text-[10px] text-slate-500 font-mono">{storm.date}</div>
              </div>
              <div>
                <div className="text-[10px] font-mono text-slate-500 mb-0.5">PEAK Kp / CLASS</div>
                <div className="text-sm font-mono font-bold text-red-400">{storm.kp} · {storm.severity}</div>
              </div>
              <div>
                <div className="text-[10px] font-mono text-slate-500 mb-0.5">INDIA IMPACT</div>
                <div className="text-xs font-mono text-orange-400">{storm.estimatedIndiaImpact}</div>
              </div>
              <div>
                <div className="text-[10px] font-mono text-slate-500 mb-0.5">NOTES</div>
                <div className="text-[10px] text-slate-400 leading-relaxed line-clamp-2">{storm.description}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 text-[10px] text-slate-600 font-mono">* Historical data for reference. India grid impact is estimated — not official records.</div>
      </div>
    </div>
  );
};
