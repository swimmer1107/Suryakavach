import React, { useState, useEffect } from 'react';
import { Server, CheckCircle, AlertTriangle, Activity, Clock, Zap } from 'lucide-react';
import { systemServices } from '../data/dataSources';
import { motion } from 'framer-motion';

export const SystemHealth: React.FC = () => {
  const [services, setServices] = useState(systemServices);
  const [uptime] = useState('99d 14h 32m');

  useEffect(() => {
    const t = setInterval(() => {
      setServices(prev => prev.map(svc => ({
        ...svc,
        latency: Math.max(8, svc.latency + (Math.random() - 0.5) * 20),
        requestsPerMin: Math.max(0, svc.requestsPerMin + Math.round((Math.random() - 0.5) * 100)),
      })));
    }, 3000);
    return () => clearInterval(t);
  }, []);

  const allOperational = services.every(s => s.status === 'operational');

  return (
    <div className="p-6 space-y-5">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="font-display font-bold text-2xl text-white">SYSTEM HEALTH</h1>
          <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono font-bold border ${allOperational ? 'bg-green-500/15 border-green-500/30 text-green-400' : 'bg-red-500/15 border-red-500/30 text-red-400'}`}>
            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${allOperational ? 'bg-green-400' : 'bg-red-400'}`} />
            {allOperational ? 'ALL SYSTEMS OPERATIONAL' : 'DEGRADED'}
          </span>
        </div>
        <p className="text-slate-500 text-xs font-mono mt-0.5">Platform uptime: {uptime} · Real-time service monitoring</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'TOTAL SERVICES', val: services.length, color: 'text-white' },
          { label: 'OPERATIONAL', val: services.filter(s => s.status === 'operational').length, color: 'text-green-400' },
          { label: 'DEGRADED', val: services.filter(s => s.status === 'degraded').length, color: 'text-yellow-400' },
          { label: 'OFFLINE', val: services.filter(s => s.status === 'offline').length, color: 'text-red-400' },
        ].map(s => (
          <div key={s.label} className="card p-4">
            <div className="text-[10px] font-mono text-slate-500 tracking-widest mb-1">{s.label}</div>
            <div className={`font-mono font-bold text-3xl ${s.color}`}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* Services */}
      <div className="space-y-3">
        {services.map((svc, i) => (
          <motion.div
            key={svc.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="card p-4"
          >
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-3 min-w-[200px]">
                <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${svc.status === 'operational' ? 'bg-green-400 animate-pulse' : svc.status === 'degraded' ? 'bg-yellow-400' : 'bg-red-400'}`} />
                <div>
                  <div className="text-sm font-medium text-white">{svc.name}</div>
                  <div className={`text-[10px] font-mono font-bold ${svc.status === 'operational' ? 'text-green-400' : svc.status === 'degraded' ? 'text-yellow-400' : 'text-red-400'}`}>
                    {svc.status.toUpperCase()}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 flex-1 flex-wrap">
                <div className="text-center">
                  <div className="text-[9px] font-mono text-slate-500 mb-0.5">LATENCY</div>
                  <div className={`text-sm font-mono font-bold ${svc.latency > 200 ? 'text-red-400' : svc.latency > 100 ? 'text-yellow-400' : 'text-green-400'}`}>
                    {Math.round(svc.latency)} ms
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-[9px] font-mono text-slate-500 mb-0.5">UPTIME</div>
                  <div className="text-sm font-mono font-bold text-white">{svc.uptime}%</div>
                </div>
                <div className="text-center">
                  <div className="text-[9px] font-mono text-slate-500 mb-0.5">REQ/MIN</div>
                  <div className="text-sm font-mono font-bold text-cyan-400">{svc.requestsPerMin.toLocaleString()}</div>
                </div>
                <div className="flex-1 min-w-[120px]">
                  <div className="text-[9px] font-mono text-slate-500 mb-1">UPTIME BAR</div>
                  <div className="h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${svc.uptime > 99 ? 'bg-green-400' : svc.uptime > 95 ? 'bg-yellow-400' : 'bg-red-400'}`}
                      style={{ width: `${svc.uptime}%` }}
                    />
                  </div>
                </div>
                <div className="text-[10px] font-mono text-slate-600 flex items-center gap-1">
                  <Clock size={10} />
                  {new Date(svc.lastCheck).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Platform metrics */}
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { label: 'ALERTS DISPATCHED TODAY', val: '47', icon: <Zap size={14} className="text-red-400" /> },
          { label: 'GVI COMPUTATIONS / HR', val: '2,304', icon: <Activity size={14} className="text-cyan-400" /> },
          { label: 'DATA POINTS INGESTED', val: '1.2M', icon: <Server size={14} className="text-green-400" /> },
        ].map(m => (
          <div key={m.label} className="card p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-slate-700/40 flex items-center justify-center flex-shrink-0">{m.icon}</div>
            <div>
              <div className="font-mono font-bold text-xl text-white">{m.val}</div>
              <div className="text-[10px] font-mono text-slate-500 tracking-wider">{m.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
