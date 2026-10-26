import React, { useState, useEffect } from 'react';
import { TrendingUp, Clock, ChevronRight, AlertTriangle, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/ui/StatusBadge';
import { motion } from 'framer-motion';

const PIPELINE_STEPS = [
  { label: 'SUN', sub: 'Solar Activity', color: '#f97316', done: true },
  { label: 'SOLAR FLARE', sub: 'X-class detected', color: '#eab308', done: true },
  { label: 'CME LAUNCH', sub: 'Coronal ejection', color: '#ef4444', done: true },
  { label: 'DSCOVR/ACE', sub: 'L1 satellite intercept', color: '#22d3ee', done: true },
  { label: 'ML ARRIVAL', sub: 'ETA prediction', color: '#a855f7', done: true },
  { label: 'GEO RESPONSE', sub: 'Magnetosphere model', color: '#3b82f6', done: true },
  { label: 'GIC ESTIMATE', sub: 'Current induction', color: '#f97316', done: false },
  { label: 'GRID VULN.', sub: 'GVI per substation', color: '#22d3ee', done: false },
  { label: 'OPERATOR ALERT', sub: 'Dispatch notifications', color: '#22c55e', done: false },
];

export const CMEPrediction: React.FC = () => {
  const { storm } = useApp();
  const [countdown, setCountdown] = useState(42 * 60);

  useEffect(() => {
    const t = setInterval(() => setCountdown(c => Math.max(0, c - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  const mins = Math.floor(countdown / 60);
  const secs = countdown % 60;

  const arrivalTime = new Date(storm.predictedArrival);
  const earlyWindow = new Date(arrivalTime.getTime() - 19 * 60000);
  const lateWindow = new Date(arrivalTime.getTime() + 19 * 60000);

  const fmt = (d: Date) => d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' });

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display font-bold text-2xl text-white">CME PREDICTION</h1>
            <StatusBadge status="simulation" size="md" />
          </div>
          <p className="text-slate-500 text-xs font-mono mt-0.5">Coronal mass ejection → Grid impact prediction pipeline</p>
        </div>
        <div className="px-4 py-2 card text-center">
          <div className="text-[9px] font-mono text-slate-500 tracking-widest">IMPACT IN</div>
          <div className="font-mono font-bold text-2xl text-red-400">{mins}:{secs.toString().padStart(2,'0')}</div>
        </div>
      </div>

      {/* Prediction Pipeline */}
      <div className="card p-5">
        <div className="font-mono font-bold text-sm text-white mb-5">CME → GRID IMPACT PREDICTION PIPELINE</div>
        <div className="flex flex-wrap items-center gap-1">
          {PIPELINE_STEPS.map((step, i) => (
            <React.Fragment key={step.label}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.08 }}
                className={`flex flex-col items-center gap-1.5 p-3 rounded border min-w-[80px] text-center
                  ${step.done ? 'border-slate-700/50 bg-slate-800/50' : 'border-slate-700/20 bg-slate-800/20 opacity-60'}`}
              >
                <div className="w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ background: `${step.color}20`, border: `1px solid ${step.color}40` }}>
                  {step.done
                    ? <CheckCircle size={12} style={{ color: step.color }} />
                    : <Clock size={12} className="text-slate-500" />
                  }
                </div>
                <div className="text-[9px] font-mono font-bold text-white">{step.label}</div>
                <div className="text-[8px] text-slate-500">{step.sub}</div>
              </motion.div>
              {i < PIPELINE_STEPS.length - 1 && (
                <ChevronRight size={12} className="text-slate-600 flex-shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {/* Prediction Card */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={14} className="text-cyan-400" />
            <span className="font-mono font-bold text-sm text-white">ARRIVAL PREDICTION</span>
          </div>

          <div className="text-center py-6 rounded bg-slate-800/50 border border-slate-700/30 mb-4">
            <div className="text-[10px] font-mono text-slate-500 tracking-widest mb-1">PREDICTED IMPACT</div>
            <div className="font-mono font-bold text-4xl text-white">{fmt(arrivalTime)}</div>
            <div className="text-sm text-slate-400 font-mono mt-1">IST</div>
            <div className="text-xs text-red-400 font-mono mt-3 font-bold">T−{mins}:{secs.toString().padStart(2,'0')} REMAINING</div>
          </div>

          <div className="space-y-2">
            <div className="text-[10px] font-mono text-slate-500 tracking-widest">PREDICTION WINDOW</div>
            <div className="flex items-center gap-2">
              <div className="text-xs font-mono text-slate-400">{fmt(earlyWindow)}</div>
              <div className="flex-1 relative h-6">
                <div className="absolute inset-y-0 left-0 right-0 flex items-center">
                  <div className="flex-1 h-px bg-slate-700/50" />
                  <div className="flex-1 h-2 bg-cyan-500/30 border border-cyan-500/40 rounded relative">
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.8)]" />
                  </div>
                  <div className="flex-1 h-px bg-slate-700/50" />
                </div>
              </div>
              <div className="text-xs font-mono text-slate-400">{fmt(lateWindow)}</div>
            </div>
            <div className="text-[10px] font-mono text-slate-500 text-center">±19 minute window · 87% confidence</div>
          </div>
        </div>

        {/* Confidence & Comparison */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={14} className="text-cyan-400" />
            <span className="font-mono font-bold text-sm text-white">PREDICTION ACCURACY</span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-slate-400">Model Confidence</span>
                <span className="text-cyan-400 font-bold">{storm.confidence}%</span>
              </div>
              <div className="h-2 bg-slate-700/50 rounded-full">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${storm.confidence}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="h-full bg-cyan-400 rounded-full"
                />
              </div>
            </div>

            <div className="space-y-3">
              {[
                { label: 'Industry Baseline', window: '±10 hrs', color: 'text-slate-400', bar: 15 },
                { label: 'SuryaKavach Model', window: '±38 min', color: 'text-cyan-400', bar: 87, highlight: true },
              ].map(item => (
                <div key={item.label} className={`p-3 rounded border ${item.highlight ? 'border-cyan-500/30 bg-cyan-500/5' : 'border-slate-700/30'}`}>
                  <div className="flex justify-between text-xs font-mono mb-1.5">
                    <span className={item.color}>{item.label}</span>
                    <span className={`font-bold ${item.color}`}>{item.window}</span>
                  </div>
                  <div className="h-1.5 bg-slate-700/50 rounded-full">
                    <div className={`h-full rounded-full ${item.highlight ? 'bg-cyan-400' : 'bg-slate-500'}`} style={{ width: `${item.bar}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 rounded bg-amber-500/10 border border-amber-500/20">
              <div className="flex items-start gap-2">
                <AlertTriangle size={12} className="text-amber-400 mt-0.5 flex-shrink-0" />
                <div className="text-[10px] text-amber-300 font-mono leading-relaxed">
                  <span className="font-bold">PROTOTYPE NOTE:</span> This prediction model is a physics-based simulation.
                  A production model would be trained on historical CME-impact pairs.
                  The ±38 min window is our target specification.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Input Parameters */}
      <div className="card p-5">
        <div className="font-mono font-bold text-sm text-white mb-4">PREDICTION INPUT PARAMETERS</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'CME VELOCITY', val: `${storm.cmeVelocity} km/s`, sub: 'Primary propagation driver' },
            { label: 'CME DIRECTION', val: 'EARTH-DIRECTED', sub: 'Halo CME confirmed' },
            { label: 'SOLAR WIND', val: `${storm.solarWindSpeed.toFixed(0)} km/s`, sub: 'Ambient medium speed' },
            { label: 'Bz AT L1', val: `${storm.bz.toFixed(1)} nT`, sub: 'Southward — coupling' },
            { label: 'LAUNCH COORDS', val: 'N12° E08°', sub: 'Solar disk position' },
            { label: 'FLARE CLASS', val: storm.xrayFlux, sub: 'Associated X-ray flare' },
            { label: 'Kp FORECAST', val: `${storm.kp.toFixed(1)} (G4)`, sub: 'Expected geomag index' },
            { label: 'DATA SOURCES', val: 'DSCOVR + NOAA', sub: 'Dual confirmation' },
          ].map(p => (
            <div key={p.label} className="p-3 rounded bg-slate-800/40 border border-slate-700/30">
              <div className="text-[9px] font-mono text-slate-500 tracking-widest mb-1">{p.label}</div>
              <div className="text-sm font-mono font-bold text-white">{p.val}</div>
              <div className="text-[9px] text-slate-600 mt-0.5">{p.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
