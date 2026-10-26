import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Building2, ArrowRight, Zap } from 'lucide-react';
import { substations } from '../data/substations';
import { RiskBadge } from '../components/ui/RiskBadge';
import { motion } from 'framer-motion';
import type { RiskLevel } from '../types';

type FilterStatus = 'all' | RiskLevel;
type SortKey = 'gvi' | 'name' | 'load' | 'age';

export const Substations: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [sortKey, setSortKey] = useState<SortKey>('gvi');
  const [sortDesc, setSortDesc] = useState(true);

  const filtered = substations
    .filter(s => {
      const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.city.toLowerCase().includes(search.toLowerCase()) || s.state.toLowerCase().includes(search.toLowerCase());
      const matchFilter = filter === 'all' || s.status === filter;
      return matchSearch && matchFilter;
    })
    .sort((a, b) => {
      let diff = 0;
      if (sortKey === 'gvi') diff = a.gvi - b.gvi;
      else if (sortKey === 'name') diff = a.name.localeCompare(b.name);
      else if (sortKey === 'load') diff = a.load - b.load;
      else if (sortKey === 'age') diff = a.transformerAge - b.transformerAge;
      return sortDesc ? -diff : diff;
    });

  const counts = {
    all: substations.length,
    critical: substations.filter(s => s.status === 'critical').length,
    high: substations.filter(s => s.status === 'high').length,
    moderate: substations.filter(s => s.status === 'moderate').length,
    safe: substations.filter(s => s.status === 'safe').length,
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDesc(!sortDesc);
    else { setSortKey(key); setSortDesc(true); }
  };

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="font-display font-bold text-2xl text-white">SUBSTATIONS</h1>
        <p className="text-slate-500 text-xs font-mono mt-0.5">India grid infrastructure · {substations.length} substations monitored</p>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {(Object.entries(counts) as [FilterStatus | 'all', number][]).map(([status, count]) => (
          <button
            key={status}
            onClick={() => setFilter(status as FilterStatus)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded border text-xs font-mono font-bold transition-all
              ${filter === status
                ? status === 'critical' ? 'bg-red-500/20 border-red-500/50 text-red-300'
                  : status === 'high' ? 'bg-orange-500/20 border-orange-500/50 text-orange-300'
                  : status === 'moderate' ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300'
                  : status === 'safe' ? 'bg-green-500/20 border-green-500/50 text-green-300'
                  : 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                : 'border-slate-700/50 text-slate-400 hover:border-slate-600'
              }`}
          >
            {status === 'all' ? 'ALL' : status.toUpperCase()}
            <span className="bg-slate-700/50 px-1.5 py-0.5 rounded text-[9px]">{count}</span>
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <div className="relative">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search..."
              className="bg-navy-800 border border-slate-700/50 rounded pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500/50 font-mono w-48"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/50 bg-navy-800/50">
                {[
                  { key: 'name', label: 'SUBSTATION' },
                  { key: null, label: 'STATE' },
                  { key: 'gvi', label: 'GVI' },
                  { key: null, label: 'STATUS' },
                  { key: 'load', label: 'LOAD %' },
                  { key: 'age', label: 'XFMR AGE' },
                  { key: null, label: 'EST. GIC' },
                  { key: null, label: 'kV' },
                  { key: null, label: '' },
                ].map(col => (
                  <th
                    key={col.label}
                    onClick={() => col.key && handleSort(col.key as SortKey)}
                    className={`px-4 py-3 text-left text-[10px] font-mono font-bold text-slate-500 tracking-widest ${col.key ? 'cursor-pointer hover:text-slate-300' : ''}`}
                  >
                    {col.label}
                    {sortKey === col.key && <span className="ml-1">{sortDesc ? '↓' : '↑'}</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {filtered.map((s, i) => (
                <motion.tr
                  key={s.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: Math.min(i * 0.03, 0.5) }}
                  className="hover:bg-slate-700/20 transition-colors cursor-pointer group"
                  onClick={() => navigate(`/substations/${s.id}`)}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                        s.status === 'critical' ? 'bg-red-400 animate-pulse' : 
                        s.status === 'high' ? 'bg-orange-400' : 
                        s.status === 'moderate' ? 'bg-yellow-400' : 'bg-green-400'
                      }`} />
                      <div>
                        <div className="text-sm text-white font-medium">{s.name}</div>
                        <div className="text-[10px] text-slate-500">{s.city}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400 font-mono">{s.state}</td>
                  <td className="px-4 py-3">
                    <span className={`font-mono font-bold text-sm ${
                      s.status === 'critical' ? 'text-red-400' :
                      s.status === 'high' ? 'text-orange-400' :
                      s.status === 'moderate' ? 'text-yellow-400' : 'text-green-400'
                    }`}>{s.gvi}</span>
                  </td>
                  <td className="px-4 py-3">
                    <RiskBadge level={s.status} size="sm" showDot />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-700/50 rounded-full">
                        <div className={`h-full rounded-full ${s.load > 85 ? 'bg-red-400' : s.load > 70 ? 'bg-orange-400' : 'bg-green-400'}`} style={{ width: `${s.load}%` }} />
                      </div>
                      <span className="text-xs font-mono text-slate-400">{s.load}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs font-mono text-slate-400">{s.transformerAge} yrs</td>
                  <td className="px-4 py-3 text-xs font-mono text-slate-300">{s.estimatedGIC} A</td>
                  <td className="px-4 py-3 text-xs font-mono text-slate-400">{s.voltageLevel} kV</td>
                  <td className="px-4 py-3">
                    <ArrowRight size={13} className="text-slate-600 group-hover:text-cyan-400 transition-colors" />
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-slate-500 text-sm font-mono">No substations match your filters.</div>
        )}
      </div>
    </div>
  );
};
