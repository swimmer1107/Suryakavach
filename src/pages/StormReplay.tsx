import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, FastForward, AlertTriangle, Activity } from 'lucide-react';
import { gannonStormReplay, historicalStorms } from '../data/stormData';
import { StatusBadge } from '../components/ui/StatusBadge';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';

const TOTAL_STEPS = gannonStormReplay.timeline.length;

export const StormReplay: React.FC = () => {
  const { setReplayMode } = useApp();
  const [playing, setPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [started, setStarted] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const step = gannonStormReplay.timeline[currentStep];
  const alertStep = gannonStormReplay.timeline.findIndex(t => t.alertTriggered);

  useEffect(() => {
    setReplayMode(true);
    return () => setReplayMode(false);
  }, []);

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setCurrentStep(s => {
          if (s >= TOTAL_STEPS - 1) { setPlaying(false); return s; }
          return s + 1;
        });
      }, 2000 / speed);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [playing, speed]);

  const handlePlay = () => {
    if (!started) setStarted(true);
    setPlaying(true);
  };

  const reset = () => {
    setPlaying(false);
    setCurrentStep(0);
    setStarted(false);
  };

  const totalSubs = step.criticalSubstations + step.highSubstations + step.moderateSubstations + step.safeSubstations;

  // Chart data up to current step
  const chartData = gannonStormReplay.timeline.slice(0, currentStep + 1).map(t => ({
    time: t.label.split(' ')[0],
    kp: t.kp,
    wind: Math.round(t.solarWindSpeed / 10),
    bz: Math.abs(t.bz),
    critical: t.criticalSubstations,
  }));

  const STATUS_COLOR: Record<string, string> = {
    critical: '#ef4444', high: '#f97316', moderate: '#eab308', safe: '#22c55e',
  };

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display font-bold text-2xl text-white">STORM REPLAY</h1>
            <StatusBadge status="replay" size="md" />
          </div>
          <p className="text-slate-500 text-xs font-mono mt-0.5">Historical storm simulation · SuryaKavach response demonstration</p>
        </div>
      </div>

      {/* Scenario selector */}
      <div className="grid md:grid-cols-3 gap-4">
        {historicalStorms.map(storm => (
          <div
            key={storm.id}
            className={`card p-4 cursor-pointer transition-all hover:border-slate-600/60 ${storm.id === gannonStormReplay.id ? 'border-cyan-500/30 bg-cyan-500/5' : ''}`}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="text-xs font-mono font-bold text-white">{storm.name}</div>
                <div className="text-[10px] text-slate-500">{storm.date}</div>
              </div>
              <span className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded border ${
                storm.kp >= 8 ? 'text-red-400 border-red-500/30 bg-red-500/10' : 'text-orange-400 border-orange-500/30 bg-orange-500/10'
              }`}>{storm.severity}</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-2">{storm.description}</p>
            {storm.id === gannonStormReplay.id && (
              <div className="mt-2 text-[10px] font-mono text-cyan-400 font-bold">← ACTIVE SCENARIO</div>
            )}
          </div>
        ))}
      </div>

      {/* Main Replay Panel */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="font-display font-bold text-lg text-white">{gannonStormReplay.name}</div>
            <div className="text-xs text-slate-500 font-mono">{gannonStormReplay.date} · Kp max {gannonStormReplay.maxKp} · G5</div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSpeed(s => s === 1 ? 2 : s === 2 ? 4 : 1)}
              className="px-3 py-1.5 rounded border border-slate-700/50 text-xs font-mono text-slate-400 hover:text-white transition-all flex items-center gap-1"
            >
              <FastForward size={12} /> {speed}×
            </button>
            <button onClick={reset} className="p-2 rounded border border-slate-700/50 text-slate-400 hover:text-white transition-all">
              <RotateCcw size={14} />
            </button>
            <button
              onClick={playing ? () => setPlaying(false) : handlePlay}
              className={`flex items-center gap-2 px-4 py-2 rounded font-mono font-bold text-sm transition-all ${playing ? 'bg-orange-500/20 border border-orange-500/40 text-orange-300' : 'bg-cyan-500 hover:bg-cyan-400 text-navy-950'}`}
            >
              {playing ? <><Pause size={15} /> PAUSE</> : <><Play size={15} fill="currentColor" /> {started ? 'RESUME' : 'PLAY REPLAY'}</>}
            </button>
          </div>
        </div>

        {/* Timeline scrubber */}
        <div className="mb-5">
          <input
            type="range"
            min="0"
            max={TOTAL_STEPS - 1}
            value={currentStep}
            onChange={e => { setCurrentStep(+e.target.value); setStarted(true); }}
            className="w-full"
          />
          <div className="flex justify-between text-[9px] font-mono text-slate-600 mt-1">
            {gannonStormReplay.timeline.map((t, i) => (
              <span key={i} className={currentStep >= i ? (t.alertTriggered ? 'text-red-400 font-bold' : 'text-cyan-400') : ''}>
                {t.label.split(' ')[0]}
              </span>
            ))}
          </div>
        </div>

        {/* Current Step Display */}
        <div className="grid md:grid-cols-2 gap-5">
          <div className="space-y-4">
            <div className={`p-4 rounded border transition-all duration-500 ${step.alertTriggered ? 'border-red-500/50 bg-red-500/10' : 'border-slate-700/40 bg-slate-800/50'}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`font-mono font-bold text-lg ${step.alertTriggered ? 'text-red-400' : 'text-cyan-400'}`}>{step.label}</span>
                {step.alertTriggered && (
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-red-500/20 border border-red-500/40"
                  >
                    <AlertTriangle size={12} className="text-red-400" />
                    <span className="text-red-300 text-[10px] font-mono font-bold">SURYAKAVACH ALERT</span>
                  </motion.div>
                )}
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">{step.description}</p>
            </div>

            {/* Live Parameters */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Kp INDEX', val: step.kp.toFixed(1), color: step.kp > 6 ? '#ef4444' : step.kp > 4 ? '#f97316' : '#22d3ee' },
                { label: 'SOLAR WIND', val: `${step.solarWindSpeed}`, unit: 'km/s', color: '#22d3ee' },
                { label: 'Bz', val: step.bz.toFixed(1), unit: 'nT', color: step.bz < -10 ? '#ef4444' : '#f97316' },
                { label: 'DENSITY', val: step.density.toFixed(1), unit: 'p/cm³', color: '#eab308' },
              ].map(m => (
                <div key={m.label} className="p-3 rounded bg-slate-800/60 border border-slate-700/30 text-center">
                  <div className="text-[9px] font-mono text-slate-500 mb-1">{m.label}</div>
                  <div className="font-mono font-bold text-xl" style={{ color: m.color }}>
                    {m.val}
                    <span className="text-xs text-slate-500 ml-1">{m.unit}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Substation risk bars */}
            <div className="space-y-2">
              <div className="text-[10px] font-mono text-slate-500 tracking-widest">SUBSTATION RISK DISTRIBUTION</div>
              {[
                { label: 'CRITICAL', count: step.criticalSubstations, color: 'bg-red-400' },
                { label: 'HIGH', count: step.highSubstations, color: 'bg-orange-400' },
                { label: 'MODERATE', count: step.moderateSubstations, color: 'bg-yellow-400' },
                { label: 'SAFE', count: step.safeSubstations, color: 'bg-green-400' },
              ].map(row => (
                <div key={row.label} className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-slate-500 w-16">{row.label}</span>
                  <div className="flex-1 h-1.5 bg-slate-700/50 rounded-full">
                    <motion.div
                      animate={{ width: `${(row.count / totalSubs) * 100}%` }}
                      transition={{ duration: 0.5 }}
                      className={`h-full ${row.color} rounded-full`}
                    />
                  </div>
                  <span className="text-xs font-mono text-white w-6 text-right">{row.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Charts */}
          <div className="space-y-3">
            <div className="text-[10px] font-mono text-slate-500 tracking-widest">STORM PROGRESSION</div>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 4, right: 0, left: -30, bottom: 0 }}>
                  <defs>
                    <linearGradient id="kpGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="time" tick={{ fontSize: 8, fill: '#475569', fontFamily: 'monospace' }} />
                  <YAxis tick={{ fontSize: 8, fill: '#475569', fontFamily: 'monospace' }} />
                  <Tooltip contentStyle={{ background: '#0d1526', border: '1px solid #334155', fontSize: 11, fontFamily: 'monospace' }} />
                  <Area type="monotone" dataKey="kp" stroke="#f97316" strokeWidth={2} fill="url(#kpGrad)" name="Kp" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="text-[10px] font-mono text-slate-500 tracking-widest">CRITICAL SUBSTATIONS OVER TIME</div>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 4, right: 0, left: -30, bottom: 0 }}>
                  <defs>
                    <linearGradient id="critGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="time" tick={{ fontSize: 8, fill: '#475569', fontFamily: 'monospace' }} />
                  <YAxis tick={{ fontSize: 8, fill: '#475569', fontFamily: 'monospace' }} />
                  <Tooltip contentStyle={{ background: '#0d1526', border: '1px solid #334155', fontSize: 11, fontFamily: 'monospace' }} />
                  <Area type="monotone" dataKey="critical" stroke="#ef4444" strokeWidth={2} fill="url(#critGrad)" name="Critical Substations" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Visual substation grid */}
            <div className="text-[10px] font-mono text-slate-500 tracking-widest">INDIA GRID RISK MAP (SIMULATED)</div>
            <div className="grid grid-cols-10 gap-1">
              {Array.from({ length: 30 }, (_, i) => {
                const sub2 = i < step.criticalSubstations ? 'critical'
                  : i < step.criticalSubstations + step.highSubstations ? 'high'
                  : i < step.criticalSubstations + step.highSubstations + step.moderateSubstations ? 'moderate'
                  : 'safe';
                return (
                  <motion.div
                    key={i}
                    animate={{ backgroundColor: STATUS_COLOR[sub2] }}
                    transition={{ duration: 0.5, delay: i * 0.02 }}
                    className="w-4 h-4 rounded-sm opacity-70"
                    style={{ backgroundColor: STATUS_COLOR[sub2] }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Replay description */}
      <div className="card p-4 bg-blue-500/5 border-blue-500/20">
        <div className="text-[10px] font-mono text-blue-400 tracking-widest mb-2 font-bold">ABOUT THIS REPLAY</div>
        <p className="text-xs text-slate-400 leading-relaxed">{gannonStormReplay.description}</p>
        <div className="mt-3 grid grid-cols-3 gap-3 text-center">
          <div className="p-2 rounded bg-slate-800/40">
            <div className="font-mono font-bold text-white text-lg">{gannonStormReplay.maxKp}</div>
            <div className="text-[10px] text-slate-500">Peak Kp</div>
          </div>
          <div className="p-2 rounded bg-slate-800/40">
            <div className="font-mono font-bold text-red-400 text-lg">{gannonStormReplay.criticalSubstations}</div>
            <div className="text-[10px] text-slate-500">Critical Subs</div>
          </div>
          <div className="p-2 rounded bg-slate-800/40">
            <div className="font-mono font-bold text-cyan-400 text-lg">42 min</div>
            <div className="text-[10px] text-slate-500">Early Warning</div>
          </div>
        </div>
      </div>
    </div>
  );
};
