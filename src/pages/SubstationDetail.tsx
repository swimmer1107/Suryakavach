import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, Zap, CheckCircle, MapPin, Clock, Activity } from 'lucide-react';
import { substations } from '../data/substations';
import { RiskBadge } from '../components/ui/RiskBadge';
import { GVIIndicator } from '../components/ui/GVIIndicator';
import { motion } from 'framer-motion';
import { MitigationModal } from '../components/MitigationModal';
import { AlertDispatchModal } from '../components/AlertDispatchModal';

const EXPOSURE_LABEL: Record<string, string> = {
  very_high: 'VERY HIGH', high: 'HIGH', moderate: 'MODERATE', low: 'LOW'
};

const RISK_FACTORS = (s: ReturnType<typeof substations[0]['state']['valueOf']>, sub: typeof substations[0]) => [
  { label: 'Storm Intensity', score: Math.round((sub.gvi / 100) * 32), max: 40, color: '#ef4444', description: `G4 storm (Kp ${sub.gvi > 75 ? '7.2' : '5.8'}) driving elevated geomagnetic activity` },
  { label: 'Latitude Factor', score: Math.round((sub.gvi / 100) * 18), max: 20, color: '#f97316', description: `${sub.latitude.toFixed(1)}°N — higher latitude increases GIC susceptibility` },
  { label: 'Transformer Age', score: Math.min(15, Math.round(sub.transformerAge / 2)), max: 15, color: '#eab308', description: `${sub.transformerAge}-year-old transformers — aging equipment less resilient to GIC` },
  { label: 'Transmission Exposure', score: sub.transmissionExposure === 'very_high' ? 14 : sub.transmissionExposure === 'high' ? 10 : 6, max: 15, color: '#a855f7', description: `${EXPOSURE_LABEL[sub.transmissionExposure]} exposure along long transmission corridors` },
  { label: 'Grid Loading', score: Math.round((sub.load / 100) * 10), max: 10, color: '#3b82f6', description: `${sub.load}% load factor — high loading amplifies GIC stress on transformers` },
  { label: 'Historical Exposure', score: sub.historicalExposure, max: 5, color: '#22d3ee', description: `${sub.historicalExposure}/5 prior storm exposure events recorded` },
];

export const SubstationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showMitigation, setShowMitigation] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const sub = substations.find(s => s.id === id);
  if (!sub) return (
    <div className="p-6 text-center text-slate-400">
      <div className="font-mono text-lg">Substation not found</div>
      <button onClick={() => navigate('/substations')} className="mt-4 btn-secondary">← BACK</button>
    </div>
  );

  const factors = RISK_FACTORS(sub.state, sub);
  const totalScore = factors.reduce((a, f) => a + f.score, 0);

  const ACTIONS = [
    'Reduce transformer loading by 12% immediately',
    'Redistribute load to adjacent substations',
    'Monitor transformer neutral current continuously',
    'Prepare backup grid configuration',
    'Increase operator monitoring frequency (every 5 min)',
    'Alert regional dispatch center',
    'Prepare manual switching procedures',
    'Deploy GIC monitoring equipment at neutral point',
  ];

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-start gap-4">
        <button onClick={() => navigate('/substations')} className="p-2 rounded text-slate-400 hover:text-white hover:bg-slate-700/40 transition-all mt-1">
          <ArrowLeft size={16} />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="font-display font-bold text-2xl text-white">{sub.name}</h1>
            <RiskBadge level={sub.status} size="lg" showDot />
          </div>
          <div className="flex items-center gap-4 mt-1 text-xs text-slate-500 font-mono flex-wrap">
            <span className="flex items-center gap-1"><MapPin size={11} />{sub.city}, {sub.state}</span>
            <span>{sub.latitude.toFixed(2)}°N, {sub.longitude.toFixed(2)}°E</span>
            <span>{sub.voltageLevel} kV</span>
            <span>{sub.region} Region</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowAlert(true)} className="btn-danger flex items-center gap-2">
            <Zap size={13} /> SEND ALERT
          </button>
          <button onClick={() => setShowMitigation(true)} className="btn-primary flex items-center gap-2">
            <Activity size={13} /> SIMULATE MITIGATION
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Left: GVI + Risk Breakdown */}
        <div className="space-y-4">
          {/* GVI Card */}
          <div className="card p-5 text-center">
            <div className="text-[10px] font-mono text-slate-500 tracking-widest mb-3">GRID VULNERABILITY INDEX</div>
            <div className="flex justify-center mb-3">
              <GVIIndicator gvi={sub.gvi} size="lg" animated />
            </div>
            <RiskBadge level={sub.status} size="md" showDot />
            <div className="mt-3 text-xs text-slate-500">
              <span className="text-white font-mono font-bold">{sub.gvi}</span> / 100 composite risk score
            </div>
          </div>

          {/* Quick Stats */}
          <div className="card p-4 space-y-3">
            {[
              { label: 'ESTIMATED GIC', val: `${sub.estimatedGIC} A`, color: sub.estimatedGIC > 100 ? 'text-red-400' : 'text-orange-400' },
              { label: 'TRANSFORMER AGE', val: `${sub.transformerAge} years`, color: sub.transformerAge > 18 ? 'text-red-400' : 'text-orange-400' },
              { label: 'CURRENT LOAD', val: `${sub.load}%`, color: sub.load > 85 ? 'text-red-400' : 'text-orange-400' },
              { label: 'VOLTAGE LEVEL', val: `${sub.voltageLevel} kV`, color: 'text-cyan-400' },
              { label: 'TX EXPOSURE', val: EXPOSURE_LABEL[sub.transmissionExposure], color: sub.transmissionExposure === 'very_high' ? 'text-red-400' : 'text-orange-400' },
              { label: 'CAPACITY', val: `${sub.capacity} MVA`, color: 'text-slate-300' },
              { label: 'LAST INSPECTION', val: sub.lastInspection, color: 'text-slate-400' },
            ].map(item => (
              <div key={item.label} className="flex justify-between items-center py-1 border-b border-slate-700/30 last:border-0">
                <span className="text-[10px] font-mono text-slate-500 tracking-wider">{item.label}</span>
                <span className={`text-xs font-mono font-bold ${item.color}`}>{item.val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Risk Breakdown + Explanation */}
        <div className="lg:col-span-2 space-y-4">
          {/* Risk Breakdown */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle size={14} className="text-orange-400" />
              <span className="font-mono font-bold text-sm text-white">RISK SCORE BREAKDOWN</span>
              <span className="ml-auto font-mono font-bold text-white">TOTAL: {totalScore} / 100</span>
            </div>
            <div className="space-y-3">
              {factors.map((f, i) => (
                <motion.div
                  key={f.label}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-300 font-medium">{f.label}</span>
                    <span className="text-xs font-mono font-bold text-white">{f.score} / {f.max}</span>
                  </div>
                  <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(f.score / f.max) * 100}%` }}
                      transition={{ duration: 0.8, delay: 0.3 + i * 0.07 }}
                      className="h-full rounded-full"
                      style={{ background: f.color, boxShadow: `0 0 6px ${f.color}60` }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-600 mt-0.5">{f.description}</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* AI Explanation */}
          <div className="card p-5 border-cyan-500/10">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-5 rounded bg-cyan-500/20 flex items-center justify-center">
                <span className="text-cyan-400 text-[10px] font-bold">AI</span>
              </div>
              <span className="font-mono font-bold text-sm text-white">WHY IS THIS SUBSTATION AT RISK?</span>
              <span className="text-[10px] font-mono text-cyan-400 border border-cyan-500/30 px-1.5 py-0.5 rounded ml-auto">EXPLAINABLE AI</span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              <span className="text-cyan-400 font-semibold">{sub.name}</span> is at{' '}
              <span className={`font-semibold ${sub.status === 'critical' ? 'text-red-400' : 'text-orange-400'}`}>{sub.status.toUpperCase()} risk</span> due to a convergence of factors:
              Strong southward magnetic-field conditions (Bz = −18.4 nT) combined with{' '}
              <span className="text-white">{EXPOSURE_LABEL[sub.transmissionExposure].toLowerCase()} transmission corridor exposure</span>,{' '}
              <span className="text-white">high transformer loading ({sub.load}%)</span>, and{' '}
              <span className="text-white">aging equipment ({sub.transformerAge} years)</span>{' '}
              significantly increase the estimated GIC risk to <span className="text-red-400 font-semibold">{sub.estimatedGIC} A</span>.{' '}
              {sub.latitude > 25 && <span>The higher latitude ({sub.latitude.toFixed(1)}°N) places this substation in a geomagnetically sensitive zone. </span>}
              Under G4 conditions, transformers at this substation are at elevated risk of thermal stress and potential damage.
            </p>
          </div>

          {/* Recommended Actions */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle size={14} className="text-green-400" />
              <span className="font-mono font-bold text-sm text-white">RECOMMENDED ACTIONS</span>
            </div>
            <div className="grid md:grid-cols-2 gap-2">
              {ACTIONS.map((action, i) => (
                <div key={i} className="flex items-start gap-2.5 p-2.5 rounded bg-slate-800/40 border border-slate-700/30">
                  <div className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-cyan-400 text-[9px] font-mono font-bold">{i + 1}</span>
                  </div>
                  <span className="text-xs text-slate-300 leading-relaxed">{action}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-3">
              <button onClick={() => setShowMitigation(true)} className="btn-primary flex items-center gap-2">
                <Activity size={13} /> SIMULATE MITIGATION
              </button>
              <button onClick={() => setShowAlert(true)} className="btn-secondary flex items-center gap-2">
                ACKNOWLEDGE RISK
              </button>
            </div>
          </div>
        </div>
      </div>

      {showMitigation && <MitigationModal substation={sub} onClose={() => setShowMitigation(false)} />}
      {showAlert && <AlertDispatchModal substation={sub} onClose={() => setShowAlert(false)} />}
    </div>
  );
};
