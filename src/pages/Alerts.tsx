import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Bell, CheckCircle, ArrowRight, Zap, Clock, Map } from 'lucide-react';
import { alerts as initialAlerts } from '../data/alerts';
import { RiskBadge } from '../components/ui/RiskBadge';
import { StatusBadge } from '../components/ui/StatusBadge';
import { AlertDispatchModal } from '../components/AlertDispatchModal';
import { substations } from '../data/substations';
import { motion, AnimatePresence } from 'framer-motion';
import type { Alert } from '../types';

export const Alerts: React.FC = () => {
  const navigate = useNavigate();
  const [alertList, setAlertList] = useState(initialAlerts);
  const [filter, setFilter] = useState<'all' | 'active' | 'acknowledged'>('all');
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [showDispatch, setShowDispatch] = useState(false);

  const acknowledge = (id: string) => {
    setAlertList(prev => prev.map(a => a.id === id ? { ...a, status: 'acknowledged' as const } : a));
  };

  const filtered = alertList.filter(a => filter === 'all' || a.status === filter);
  const active = alertList.filter(a => a.status === 'active').length;
  const critical = alertList.filter(a => a.severity === 'critical' && a.status === 'active').length;
  const high = alertList.filter(a => a.severity === 'high' && a.status === 'active').length;
  const acked = alertList.filter(a => a.status === 'acknowledged').length;

  const severityIcon = {
    critical: <span className="text-red-400">🚨</span>,
    high: <span className="text-orange-400">⚠️</span>,
    moderate: <span className="text-yellow-400">⚡</span>,
    low: <span className="text-blue-400">ℹ️</span>,
  };

  const sub = selectedAlert?.substationId ? substations.find(s => s.id === selectedAlert.substationId) : undefined;

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display font-bold text-2xl text-white">ALERT CENTER</h1>
            <StatusBadge status="live" size="md" />
          </div>
          <p className="text-slate-500 text-xs font-mono mt-0.5">Active alerts require operator acknowledgement</p>
        </div>
        <button
          onClick={() => setShowDispatch(true)}
          className="flex items-center gap-2 px-4 py-2 bg-red-500/15 hover:bg-red-500/25 border border-red-500/40 text-red-300 text-xs font-mono font-bold rounded transition-all"
        >
          <Zap size={13} /> SEND BULK ALERT
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'ACTIVE ALERTS', val: active, color: 'text-white', bg: 'border-slate-700/40' },
          { label: 'CRITICAL', val: critical, color: 'text-red-400', bg: 'border-red-500/20 bg-red-500/5' },
          { label: 'HIGH', val: high, color: 'text-orange-400', bg: 'border-orange-500/20 bg-orange-500/5' },
          { label: 'ACKNOWLEDGED', val: acked, color: 'text-green-400', bg: 'border-green-500/20 bg-green-500/5' },
        ].map(s => (
          <div key={s.label} className={`card p-4 ${s.bg}`}>
            <div className="text-[10px] font-mono text-slate-500 tracking-widest mb-1">{s.label}</div>
            <div className={`font-mono font-bold text-3xl ${s.color}`}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {(['all', 'active', 'acknowledged'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded border text-xs font-mono font-bold transition-all ${filter === f ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300' : 'border-slate-700/50 text-slate-400 hover:border-slate-600'}`}
          >
            {f.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Alert list */}
      <div className="grid lg:grid-cols-2 gap-4">
        {filtered.map((alert, i) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className={`card p-4 cursor-pointer hover:border-slate-600/60 transition-all
              ${alert.severity === 'critical' && alert.status === 'active' ? 'border-red-500/25 bg-red-500/3' : ''}
              ${alert.status === 'acknowledged' ? 'opacity-60' : ''}
              ${selectedAlert?.id === alert.id ? 'border-cyan-500/40' : ''}`}
            onClick={() => setSelectedAlert(selectedAlert?.id === alert.id ? null : alert)}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                {severityIcon[alert.severity]}
                <RiskBadge level={alert.severity as any} size="sm" showDot={alert.status === 'active'} />
                <span className="text-[10px] font-mono text-slate-500">#{alert.alertNumber}</span>
              </div>
              {alert.status === 'acknowledged' && (
                <span className="flex items-center gap-1 text-[10px] font-mono text-green-400">
                  <CheckCircle size={11} /> ACK
                </span>
              )}
            </div>

            <div className="font-medium text-sm text-white mb-1.5 leading-tight">{alert.title}</div>

            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] font-mono text-slate-500 mb-3">
              {alert.substationName && <span className="flex items-center gap-1"><Map size={10} />{alert.substationName}</span>}
              {alert.gvi && <span className="text-orange-400 font-bold">GVI {alert.gvi}</span>}
              {alert.estimatedGIC && <span>GIC: {alert.estimatedGIC} A</span>}
              {alert.affectedSubstations && <span>{alert.affectedSubstations} substations</span>}
              <span className="flex items-center gap-1"><Clock size={10} />{new Date(alert.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} IST</span>
            </div>

            <AnimatePresence>
              {selectedAlert?.id === alert.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-3 border-t border-slate-700/30 space-y-3">
                    <p className="text-xs text-slate-400 leading-relaxed">{alert.message}</p>

                    {alert.recommendedActions?.length > 0 && (
                      <div>
                        <div className="text-[10px] font-mono text-slate-500 mb-1.5 tracking-wider">RECOMMENDED ACTIONS</div>
                        <ul className="space-y-1">
                          {alert.recommendedActions.map((a, j) => (
                            <li key={j} className="flex items-start gap-2 text-xs text-slate-300">
                              <span className="text-cyan-400 mt-0.5 flex-shrink-0">→</span> {a}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {alert.impactWindow && (
                      <div className="text-[10px] font-mono text-slate-500">
                        IMPACT WINDOW: <span className="text-white">{alert.impactWindow} IST</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-1">
                      {alert.status === 'active' && (
                        <button
                          onClick={e => { e.stopPropagation(); acknowledge(alert.id); }}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/15 hover:bg-green-500/25 border border-green-500/30 text-green-300 text-xs font-mono rounded transition-all"
                        >
                          <CheckCircle size={11} /> ACKNOWLEDGE
                        </button>
                      )}
                      {alert.substationId && (
                        <button
                          onClick={e => { e.stopPropagation(); navigate(`/substations/${alert.substationId}`); }}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700/40 hover:bg-slate-700/60 border border-slate-600/50 text-slate-300 text-xs font-mono rounded transition-all"
                        >
                          VIEW IMPACT <ArrowRight size={11} />
                        </button>
                      )}
                      <button
                        onClick={e => { e.stopPropagation(); setShowDispatch(true); }}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-300 text-xs font-mono rounded transition-all ml-auto"
                      >
                        <Zap size={11} /> SEND ALERT
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {showDispatch && (
        <AlertDispatchModal substation={sub} onClose={() => setShowDispatch(false)} />
      )}
    </div>
  );
};
