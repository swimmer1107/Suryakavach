import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wrench, ArrowRight } from 'lucide-react';
import { substations } from '../data/substations';
import { RiskBadge } from '../components/ui/RiskBadge';
import { GVIIndicator } from '../components/ui/GVIIndicator';
import { MitigationModal } from '../components/MitigationModal';
import type { Substation } from '../types';

export const Mitigation: React.FC = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Substation | null>(null);
  const [showModal, setShowModal] = useState(false);

  const highRisk = substations.filter(s => s.status === 'critical' || s.status === 'high').sort((a, b) => b.gvi - a.gvi);

  return (
    <div className="p-6 space-y-5">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="font-display font-bold text-2xl text-white">MITIGATION SIMULATOR</h1>
          <span className="text-[10px] font-mono text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded">SIMULATION ONLY</span>
        </div>
        <p className="text-slate-500 text-xs font-mono mt-0.5">Simulate protective actions — does not control actual grid infrastructure</p>
      </div>

      <div className="p-3 rounded bg-amber-500/10 border border-amber-500/20">
        <p className="text-xs text-amber-300 font-mono">
          <span className="font-bold">⚠ SIMULATION DISCLAIMER:</span> All actions here are simulated for planning purposes only.
          This tool does NOT send commands to real grid infrastructure. For actual grid control, use your certified SCADA/EMS system.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {highRisk.map((sub, i) => (
          <div
            key={sub.id}
            className={`card p-4 cursor-pointer hover:border-slate-600/60 transition-all ${selected?.id === sub.id ? 'border-cyan-500/40' : ''}`}
            onClick={() => setSelected(sub)}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="text-sm font-medium text-white">{sub.name}</div>
                <div className="text-[10px] text-slate-500 font-mono">{sub.city}, {sub.state}</div>
              </div>
              <GVIIndicator gvi={sub.gvi} size="sm" />
            </div>
            <div className="flex items-center gap-2 mb-3">
              <RiskBadge level={sub.status} size="sm" showDot />
              <span className="text-[10px] font-mono text-slate-500">GIC: {sub.estimatedGIC} A</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={e => { e.stopPropagation(); setSelected(sub); setShowModal(true); }}
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-[10px] font-mono font-bold rounded transition-all"
              >
                <Wrench size={11} /> SIMULATE
              </button>
              <button
                onClick={e => { e.stopPropagation(); navigate(`/substations/${sub.id}`); }}
                className="px-3 py-1.5 bg-slate-700/40 hover:bg-slate-700/60 border border-slate-600/40 text-slate-300 text-[10px] font-mono rounded transition-all"
              >
                <ArrowRight size={11} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && selected && (
        <MitigationModal substation={selected} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};
