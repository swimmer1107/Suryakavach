import React, { useState } from 'react';
import { Settings as SettingsIcon, Bell, Shield, Database, Monitor, Save } from 'lucide-react';

export const Settings: React.FC = () => {
  const [alertThreshold, setAlertThreshold] = useState(70);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(30);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const Toggle: React.FC<{ value: boolean; onChange: (v: boolean) => void }> = ({ value, onChange }) => (
    <button
      onClick={() => onChange(!value)}
      className={`relative w-10 h-5 rounded-full transition-colors ${value ? 'bg-cyan-500' : 'bg-slate-700'}`}
    >
      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${value ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  );

  return (
    <div className="p-6 space-y-5 max-w-2xl">
      <div>
        <h1 className="font-display font-bold text-2xl text-white">SETTINGS</h1>
        <p className="text-slate-500 text-xs font-mono mt-0.5">Platform configuration · Prototype settings</p>
      </div>

      {/* Alert Settings */}
      <div className="card p-5 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Bell size={14} className="text-cyan-400" />
          <span className="font-mono font-bold text-sm text-white">ALERT CONFIGURATION</span>
        </div>

        <div>
          <div className="flex justify-between text-xs font-mono mb-2">
            <span className="text-slate-400">GVI Alert Threshold</span>
            <span className="text-cyan-400 font-bold">{alertThreshold}</span>
          </div>
          <input type="range" min="30" max="90" value={alertThreshold} onChange={e => setAlertThreshold(+e.target.value)} className="w-full" />
          <div className="flex justify-between text-[10px] font-mono text-slate-600 mt-1">
            <span>30 (Sensitive)</span><span>90 (Critical only)</span>
          </div>
        </div>

        <div className="space-y-3">
          {[
            { label: 'Email Alerts', sub: 'operator@powergrid.in', val: emailAlerts, set: setEmailAlerts },
            { label: 'SMS Alerts', sub: '+91-XXXXXXXXXX', val: smsAlerts, set: setSmsAlerts },
            { label: 'WhatsApp Alerts', sub: 'WhatsApp Business API', val: whatsappAlerts, set: setWhatsappAlerts },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between py-2 border-b border-slate-700/30 last:border-0">
              <div>
                <div className="text-sm text-white">{item.label}</div>
                <div className="text-[10px] text-slate-500 font-mono">{item.sub}</div>
              </div>
              <Toggle value={item.val} onChange={item.set} />
            </div>
          ))}
        </div>
      </div>

      {/* Display Settings */}
      <div className="card p-5 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Monitor size={14} className="text-cyan-400" />
          <span className="font-mono font-bold text-sm text-white">DISPLAY</span>
        </div>

        <div>
          <div className="flex justify-between text-xs font-mono mb-2">
            <span className="text-slate-400">Data Refresh Interval</span>
            <span className="text-cyan-400 font-bold">{autoRefresh}s</span>
          </div>
          <input type="range" min="5" max="120" step="5" value={autoRefresh} onChange={e => setAutoRefresh(+e.target.value)} className="w-full" />
        </div>
      </div>

      {/* System Info */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-3">
          <Shield size={14} className="text-cyan-400" />
          <span className="font-mono font-bold text-sm text-white">SYSTEM INFO</span>
        </div>
        <div className="space-y-2 text-xs font-mono">
          {[
            ['Platform', 'SuryaKavach v1.0.0'],
            ['Build', 'Hackathon Prototype · 2026'],
            ['Data Mode', 'LIVE + SIMULATED FALLBACK'],
            ['Auth', 'Prototype Authentication'],
            ['Role', 'GRID_OPERATOR · Northern Region'],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between py-1.5 border-b border-slate-700/20 last:border-0">
              <span className="text-slate-500">{k}</span>
              <span className="text-slate-300">{v}</span>
            </div>
          ))}
        </div>
      </div>

      <button onClick={handleSave} className="btn-primary flex items-center gap-2">
        <Save size={14} />
        {saved ? '✓ SAVED' : 'SAVE SETTINGS'}
      </button>
    </div>
  );
};
