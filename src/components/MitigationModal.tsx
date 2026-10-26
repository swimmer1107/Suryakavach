import React, { useState } from 'react';
import { X, Activity, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { RiskBadge, getRiskFromGVI } from './ui/RiskBadge';
import { GVIIndicator } from './ui/GVIIndicator';
import type { Substation } from '../types';

interface MitigationModalProps {
  substation: Substation;
  onClose: () => void;
}

export const MitigationModal: React.FC<MitigationModalProps> = ({ substation, onClose }) => {
  const [loadReduction, setLoadReduction] = useState(0);
  const [backupConfig, setBackupConfig] = useState(false);
  const [rerouting, setRerouting] = useState(false);
  const [simulated, setSimulated] = useState(false);
  const [simulating, setSimulating] = useState(false);

  const calcNewGVI = () => {
    let reduction = loadReduction * 0.15;
    if (backupConfig) reduction += 8;
    if (rerouting) reduction += 5;
    return Math.max(20, Math.round(substation.gvi - reduction));
  };

  const calcNewLoad = () => Math.max(40, Math.round(substation.load * (1 - loadReduction / 100)));
  const calcNewGIC = () => Math.max(20, Math.round(substation.estimatedGIC * (1 - loadReduction / 150) * (backupConfig ? 0.75 : 1)));

  const newGVI = calcNewGVI();
  const newLoad = calcNewLoad();
  const newGIC = calcNewGIC();
  const newStatus = getRiskFromGVI(newGVI);

  const handleSimulate = async () => {
    setSimulating(true);
    await new Promise(r => setTimeout(r, 1200));
    setSimulating(false);
    setSimulated(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-2xl bg-navy-800 border border-slate-700/50 rounded-xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/50 bg-navy-900/50">
          <div>
            <div className="flex items-center gap-2">
              <Activity size={15} className="text-cyan-400" />
              <span className="font-mono font-bold text-white tracking-wide">MITIGATION SIMULATOR</span>
            </div>
            <div className="text-xs text-slate-500 font-mono mt-0.5">{substation.name} · SIMULATION ONLY — NOT ACTUAL GRID CONTROL</div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Disclaimer */}
          <div className="p-2.5 rounded bg-amber-500/10 border border-amber-500/20 flex items-center gap-2">
            <AlertTriangle size={12} className="text-amber-400 flex-shrink-0" />
            <span className="text-[10px] text-amber-300 font-mono">SIMULATION ONLY — This does not control actual grid infrastructure. For planning purposes only.</span>
          </div>

          {/* Before/After */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded bg-slate-800/60 border border-slate-700/40 text-center">
              <div className="text-[10px] font-mono text-slate-500 tracking-widest mb-2">BEFORE MITIGATION</div>
              <GVIIndicator gvi={substation.gvi} size="md" />
              <div className="mt-2 space-y-1 text-left">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-500">Load</span>
                  <span className="text-red-400 font-bold">{substation.load}%</span>
                </div>
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-500">Est. GIC</span>
                  <span className="text-red-400 font-bold">{substation.estimatedGIC} A</span>
                </div>
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-500">Status</span>
                  <RiskBadge level={substation.status} size="sm" />
                </div>
              </div>
            </div>

            <div className={`p-4 rounded border text-center transition-all duration-500 ${simulated ? 'border-green-500/30 bg-green-500/5' : 'border-slate-700/40 bg-slate-800/30 opacity-60'}`}>
              <div className="text-[10px] font-mono text-slate-500 tracking-widest mb-2">AFTER MITIGATION</div>
              <GVIIndicator gvi={simulated ? newGVI : substation.gvi} size="md" animated />
              <div className="mt-2 space-y-1 text-left">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-500">Load</span>
                  <span className={simulated ? 'text-green-400 font-bold' : 'text-slate-500'}>{simulated ? `${newLoad}%` : '—'}</span>
                </div>
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-500">Est. GIC</span>
                  <span className={simulated ? 'text-green-400 font-bold' : 'text-slate-500'}>{simulated ? `${newGIC} A` : '—'}</span>
                </div>
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-500">Status</span>
                  {simulated ? <RiskBadge level={newStatus} size="sm" /> : <span className="text-slate-500">—</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-mono mb-2">
                <span className="text-slate-300">Load Redistribution</span>
                <span className="text-cyan-400 font-bold">−{loadReduction}%</span>
              </div>
              <input
                type="range" min="0" max="25" value={loadReduction}
                onChange={e => { setLoadReduction(+e.target.value); setSimulated(false); }}
                className="w-full"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-600 mt-1">
                <span>0% (No change)</span><span>25% (Max safe)</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => { setBackupConfig(!backupConfig); setSimulated(false); }}
                className={`p-3 rounded border text-xs font-mono font-bold transition-all text-left ${backupConfig ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300' : 'border-slate-700/50 text-slate-400 hover:border-slate-600'}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-3 h-3 rounded border ${backupConfig ? 'bg-cyan-500 border-cyan-400' : 'border-slate-600'}`} />
                  BACKUP CONFIG
                </div>
                <div className="text-[10px] text-slate-500 font-normal">Activate alternate transformer configuration</div>
              </button>
              <button
                onClick={() => { setRerouting(!rerouting); setSimulated(false); }}
                className={`p-3 rounded border text-xs font-mono font-bold transition-all text-left ${rerouting ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300' : 'border-slate-700/50 text-slate-400 hover:border-slate-600'}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-3 h-3 rounded border ${rerouting ? 'bg-cyan-500 border-cyan-400' : 'border-slate-600'}`} />
                  TX REROUTING
                </div>
                <div className="text-[10px] text-slate-500 font-normal">Reroute through alternate transmission path</div>
              </button>
            </div>
          </div>

          {/* Result Banner (after simulation) */}
          <AnimatePresence>
            {simulated && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded bg-green-500/10 border border-green-500/30 flex items-center gap-3"
              >
                <CheckCircle size={16} className="text-green-400 flex-shrink-0" />
                <div>
                  <div className="text-green-300 font-mono font-bold text-sm">
                    GVI: {substation.gvi} → {newGVI} · Status: {substation.status.toUpperCase()} → {newStatus.toUpperCase()}
                  </div>
                  <div className="text-slate-400 text-xs mt-0.5">
                    Load reduced by {substation.load - newLoad}% · GIC reduced by {substation.estimatedGIC - newGIC} A
                    {backupConfig && ' · Backup config active'}
                    {rerouting && ' · Transmission rerouted'}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action buttons */}
          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={handleSimulate}
              disabled={simulating || (loadReduction === 0 && !backupConfig && !rerouting)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-navy-950 font-bold text-sm font-mono rounded transition-all"
            >
              {simulating ? (
                <><div className="w-4 h-4 border-2 border-navy-900/50 border-t-navy-900 rounded-full animate-spin" /> SIMULATING...</>
              ) : 'RUN SIMULATION'}
            </button>
            <button onClick={onClose} className="btn-secondary px-6">CLOSE</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
