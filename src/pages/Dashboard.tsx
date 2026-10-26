import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Zap, Activity, Map, TrendingUp, ArrowRight, Clock, Shield, Radio } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { AnimatedCounter } from '../components/ui/AnimatedCounter';
import { RiskBadge } from '../components/ui/RiskBadge';
import { StatusBadge } from '../components/ui/StatusBadge';
import { SparklineChart } from '../components/ui/SparklineChart';
import { substations, getCriticalCount, getHighCount, getAffectedCount } from '../data/substations';
import { alerts } from '../data/alerts';
import { solarWindData, bzData, kpData } from '../data/stormData';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';

const MINI_WIND = solarWindData.slice(-20).map(d => d.value);
const MINI_BZ = bzData.slice(-20).map(d => d.value);
const MINI_KP = kpData.slice(-20).map(d => d.value);

export const Dashboard: React.FC = () => {
  const { storm, isDemoMode, setDemoMode, setReplayMode } = useApp();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(42 * 60);

  useEffect(() => {
    const t = setInterval(() => setCountdown(c => Math.max(0, c - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  const mins = Math.floor(countdown / 60);
  const secs = countdown % 60;

  const criticalCount = getCriticalCount();
  const affectedCount = getAffectedCount();
  const activeAlerts = alerts.filter(a => a.status === 'active').length;

  const topSubstations = substations
    .sort((a, b) => b.gvi - a.gvi)
    .slice(0, 5);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display font-bold text-2xl text-white tracking-wide">COMMAND CENTER</h1>
            <StatusBadge status="live" size="md" />
          </div>
          <p className="text-slate-500 text-sm font-mono mt-0.5">India Grid · Space Weather Monitoring · {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
        <div className="flex items-center gap-3">
          {!isDemoMode && (
            <button
              onClick={() => setDemoMode(true)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/40 text-purple-300 text-xs font-mono font-bold rounded transition-all tracking-wider"
            >
              <Radio size={13} />
              DEMO MODE
            </button>
          )}
          <button
            onClick={() => { setReplayMode(true); navigate('/replay'); }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/40 text-blue-300 text-xs font-mono font-bold rounded transition-all tracking-wider"
          >
            ▶ STORM REPLAY
          </button>
        </div>
      </div>

      {/* Top Alert Banner */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-4"
      >
        <div className="w-8 h-8 rounded bg-red-500/20 flex items-center justify-center flex-shrink-0">
          <AlertTriangle size={16} className="text-red-400" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <span className="text-red-300 font-mono font-bold text-sm tracking-wider">🚨 CRITICAL GRID ALERT — G4 GEOMAGNETIC STORM</span>
            <RiskBadge level="critical" size="sm" showDot />
          </div>
          <p className="text-slate-400 text-xs mt-0.5">
            CME arrival in <span className="text-red-300 font-mono font-bold">{mins}m {secs.toString().padStart(2,'0')}s</span> ·
            Affected: <span className="text-white font-semibold">{affectedCount} substations</span> ·
            Critical: <span className="text-red-300 font-semibold">{criticalCount} substations</span> ·
            Primary region: <span className="text-white">North-West India</span>
          </p>
        </div>
        <button
          onClick={() => navigate('/alerts')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 text-xs font-mono rounded transition-all"
        >
          VIEW ALERTS <ArrowRight size={11} />
        </button>
      </motion.div>

      {/* Status Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          {
            label: 'STORM STATUS',
            value: storm.severity,
            sub: 'SEVERE',
            color: 'text-red-400',
            bg: 'border-red-500/20 bg-red-500/5',
            icon: <Zap size={14} className="text-red-400" />,
          },
          {
            label: 'ARRIVAL ETA',
            value: `T−${mins}:${secs.toString().padStart(2,'0')}`,
            sub: 'MINUTES',
            color: 'text-orange-400',
            bg: 'border-orange-500/20 bg-orange-500/5',
            icon: <Clock size={14} className="text-orange-400" />,
          },
          {
            label: 'GRID RISK',
            value: '71',
            sub: '/ 100 GVI',
            color: 'text-orange-400',
            bg: 'border-orange-500/20 bg-orange-500/5',
            icon: <Shield size={14} className="text-orange-400" />,
          },
          {
            label: 'AFFECTED SUBS',
            value: affectedCount.toString(),
            sub: `CRITICAL: ${criticalCount}`,
            color: 'text-red-400',
            bg: 'border-red-500/20 bg-red-500/5',
            icon: <Map size={14} className="text-red-400" />,
          },
          {
            label: 'DATA CONFIDENCE',
            value: '87%',
            sub: 'NOAA + DSCOVR',
            color: 'text-cyan-400',
            bg: 'border-cyan-500/20 bg-cyan-500/5',
            icon: <Activity size={14} className="text-cyan-400" />,
          },
        ].map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className={`card p-4 ${card.bg}`}
          >
            <div className="flex items-center gap-1.5 mb-2">
              {card.icon}
              <span className="text-[10px] font-mono text-slate-500 tracking-widest uppercase">{card.label}</span>
            </div>
            <div className={`font-mono font-bold text-xl ${card.color}`}>{card.value}</div>
            <div className="text-[10px] text-slate-500 font-mono mt-0.5">{card.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Live Storm Panel */}
        <div className="lg:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity size={15} className="text-cyan-400" />
              <span className="font-mono font-bold text-sm text-white tracking-wide">LIVE STORM INTELLIGENCE</span>
              <StatusBadge status="live" />
            </div>
            <button onClick={() => navigate('/storm-intelligence')} className="text-xs text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1">
              FULL VIEW <ArrowRight size={11} />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { label: 'SOLAR WIND', value: storm.solarWindSpeed.toFixed(0), unit: 'km/s', color: 'text-cyan-400', data: MINI_WIND, lineColor: '#22d3ee', trend: '↑' },
              { label: 'Bz COMPONENT', value: storm.bz.toFixed(1), unit: 'nT', color: 'text-red-400', data: MINI_BZ, lineColor: '#ef4444', trend: '↓', critical: true },
              { label: 'Kp INDEX', value: storm.kp.toFixed(1), unit: '', color: 'text-orange-400', data: MINI_KP, lineColor: '#f97316', trend: '↑' },
              { label: 'DENSITY', value: storm.density.toFixed(1), unit: 'p/cm³', color: 'text-yellow-400', data: MINI_WIND.map(v=>v/60), lineColor: '#eab308', trend: '↑' },
              { label: 'X-RAY FLUX', value: storm.xrayFlux, unit: '', color: 'text-purple-400', data: null, trend: '' },
              { label: 'CME STATUS', value: 'EARTH-DIR', unit: '', color: 'text-red-400', data: null, trend: '' },
            ].map(m => (
              <div key={m.label} className={`p-3 rounded bg-slate-800/50 border ${m.critical ? 'border-red-500/30 bg-red-500/5' : 'border-slate-700/40'}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9px] font-mono text-slate-500 tracking-widest">{m.label}</span>
                  {m.critical && <span className="text-[9px] font-mono text-red-400 font-bold">CRITICAL</span>}
                </div>
                <div className={`font-mono font-bold text-lg ${m.color}`}>
                  {m.value}
                  <span className="text-xs text-slate-500 ml-1">{m.unit}</span>
                </div>
                {m.data && (
                  <div className="mt-1.5">
                    <SparklineChart data={m.data} color={m.lineColor} width={90} height={24} />
                  </div>
                )}
                {m.trend && !m.data && (
                  <div className={`text-xs font-mono mt-1 ${m.trend === '↑' ? 'text-red-400' : 'text-red-400'}`}>{m.trend} RISING</div>
                )}
              </div>
            ))}
          </div>

          {/* Bz alert note */}
          <div className="mt-4 p-2.5 rounded bg-red-500/10 border border-red-500/20 flex items-center gap-2">
            <AlertTriangle size={12} className="text-red-400 flex-shrink-0" />
            <span className="text-[11px] text-red-300 font-mono">
              <span className="font-bold">Southward Bz (−{Math.abs(storm.bz).toFixed(1)} nT)</span> — primary GIC trigger. Strongly coupled with Earth's magnetosphere.
            </span>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Active Alerts */}
          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono font-bold text-sm text-white">ACTIVE ALERTS</span>
              <button onClick={() => navigate('/alerts')} className="text-xs text-cyan-400 font-mono">VIEW ALL</button>
            </div>
            <div className="space-y-2">
              {alerts.filter(a => a.status === 'active').slice(0, 3).map(a => (
                <div key={a.id} className={`p-2.5 rounded border text-xs cursor-pointer hover:opacity-80 transition-opacity
                  ${a.severity === 'critical' ? 'bg-red-500/10 border-red-500/30' : 'bg-orange-500/10 border-orange-500/30'}`}
                  onClick={() => navigate('/alerts')}
                >
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${a.severity === 'critical' ? 'bg-red-400' : 'bg-orange-400'}`} />
                    <span className={`font-mono font-bold text-[10px] tracking-wider ${a.severity === 'critical' ? 'text-red-400' : 'text-orange-400'}`}>
                      {a.severity.toUpperCase()}
                    </span>
                    <span className="text-slate-500 text-[10px] font-mono ml-auto">#{a.alertNumber}</span>
                  </div>
                  <div className="text-slate-300 text-[11px] leading-tight">{a.title}</div>
                  {a.substationName && (
                    <div className="text-slate-500 text-[10px] mt-0.5 font-mono">{a.substationName} · GVI {a.gvi}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Top Risk Substations */}
          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono font-bold text-sm text-white">TOP RISK SUBSTATIONS</span>
              <button onClick={() => navigate('/substations')} className="text-xs text-cyan-400 font-mono">VIEW ALL</button>
            </div>
            <div className="space-y-2">
              {topSubstations.map((s, i) => (
                <div key={s.id}
                  className="flex items-center gap-3 py-1.5 cursor-pointer hover:bg-slate-700/20 rounded px-1 transition-all"
                  onClick={() => navigate(`/substations/${s.id}`)}
                >
                  <span className="text-[10px] font-mono text-slate-600 w-4">{i + 1}</span>
                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${s.status === 'critical' ? 'bg-red-400 animate-pulse' : s.status === 'high' ? 'bg-orange-400' : 'bg-yellow-400'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-white font-medium truncate">{s.name}</div>
                    <div className="text-[10px] text-slate-500">{s.city}</div>
                  </div>
                  <RiskBadge level={s.status} gvi={s.gvi} size="sm" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* GVI Distribution */}
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono font-bold text-sm text-white">GVI DISTRIBUTION</span>
            <button onClick={() => navigate('/analytics/gvi')} className="text-xs text-cyan-400 font-mono">DETAILS</button>
          </div>
          <div className="space-y-2">
            {[
              { label: 'CRITICAL (76–100)', count: getCriticalCount(), color: 'bg-red-500', barColor: 'bg-red-400' },
              { label: 'HIGH (51–75)', count: getHighCount(), color: 'bg-orange-500', barColor: 'bg-orange-400' },
              { label: 'MODERATE (26–50)', count: substations.filter(s=>s.status==='moderate').length, color: 'bg-yellow-500', barColor: 'bg-yellow-400' },
              { label: 'SAFE (0–25)', count: substations.filter(s=>s.status==='safe').length, color: 'bg-green-500', barColor: 'bg-green-400' },
            ].map(row => (
              <div key={row.label}>
                <div className="flex justify-between text-[10px] font-mono mb-1">
                  <span className="text-slate-400">{row.label}</span>
                  <span className="text-white font-bold">{row.count}</span>
                </div>
                <div className="h-1.5 bg-slate-700/50 rounded-full">
                  <div className={`h-full ${row.barColor} rounded-full transition-all duration-1000`} style={{ width: `${(row.count / substations.length) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card p-4">
          <span className="font-mono font-bold text-sm text-white block mb-3">QUICK ACTIONS</span>
          <div className="space-y-2">
            {[
              { label: 'View India Grid Map', icon: <Map size={13} />, path: '/grid-map', color: 'text-cyan-400', bg: 'hover:bg-cyan-500/10' },
              { label: 'Open Alert Center', icon: <AlertTriangle size={13} />, path: '/alerts', color: 'text-red-400', bg: 'hover:bg-red-500/10' },
              { label: 'CME Prediction', icon: <TrendingUp size={13} />, path: '/prediction', color: 'text-orange-400', bg: 'hover:bg-orange-500/10' },
              { label: 'Launch Storm Replay', icon: <Activity size={13} />, path: '/replay', color: 'text-blue-400', bg: 'hover:bg-blue-500/10' },
              { label: 'Mitigation Simulator', icon: <Shield size={13} />, path: '/mitigation', color: 'text-green-400', bg: 'hover:bg-green-500/10' },
            ].map(action => (
              <button
                key={action.path}
                onClick={() => navigate(action.path)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded border border-transparent hover:border-slate-700/50 ${action.bg} transition-all text-left`}
              >
                <span className={action.color}>{action.icon}</span>
                <span className="text-sm text-slate-300 hover:text-white transition-colors">{action.label}</span>
                <ArrowRight size={11} className="ml-auto text-slate-600" />
              </button>
            ))}
          </div>
        </div>

        {/* Prediction info */}
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono font-bold text-sm text-white">PREDICTION STATUS</span>
            <StatusBadge status="simulation" />
          </div>
          <div className="space-y-3">
            <div className="text-center py-3 px-2 rounded bg-slate-800/50">
              <div className="text-[10px] font-mono text-slate-500 tracking-widest mb-1">PREDICTED ARRIVAL</div>
              <div className="font-mono font-bold text-xl text-white">
                {new Date(storm.predictedArrival).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' })} IST
              </div>
              <div className="text-xs text-slate-400 mt-0.5 font-mono">±38 min window</div>
            </div>
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-500">CONFIDENCE</span>
              <span className="text-cyan-400 font-bold">{storm.confidence}%</span>
            </div>
            <div className="h-1.5 bg-slate-700/50 rounded-full">
              <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${storm.confidence}%` }} />
            </div>
            <button
              onClick={() => navigate('/prediction')}
              className="w-full text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center justify-center gap-1 mt-2 py-1.5 border border-cyan-500/20 hover:border-cyan-500/40 rounded transition-all"
            >
              FULL PREDICTION DETAILS <ArrowRight size={11} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
