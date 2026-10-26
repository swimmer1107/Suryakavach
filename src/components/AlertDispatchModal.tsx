import React, { useState } from 'react';
import { X, Send, Check, Loader, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Substation } from '../types';

type Stage = 'compose' | 'preparing' | 'dispatching' | 'delivered';

interface AlertDispatchModalProps {
  substation?: Substation;
  onClose: () => void;
}

const RECIPIENTS = [
  { id: 'r1', label: 'Northern Grid Control', dept: 'NLDC · New Delhi' },
  { id: 'r2', label: 'Agra Regional Control', dept: 'UP Transmission Corp' },
  { id: 'r3', label: 'UP Transmission HQ', dept: 'UPTCL · Lucknow' },
];

const CHANNELS = [
  { id: 'sms', label: 'SMS', icon: '📱' },
  { id: 'whatsapp', label: 'WhatsApp', icon: '💬' },
  { id: 'email', label: 'Email', icon: '📧' },
];

export const AlertDispatchModal: React.FC<AlertDispatchModalProps> = ({ substation, onClose }) => {
  const [stage, setStage] = useState<Stage>('compose');
  const [selectedRecipients, setSelectedRecipients] = useState(['r1', 'r2', 'r3']);
  const [selectedChannels, setSelectedChannels] = useState(['sms', 'whatsapp', 'email']);

  const toggle = (arr: string[], setArr: (v: string[]) => void, val: string) => {
    setArr(arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]);
  };

  const handleDispatch = async () => {
    setStage('preparing');
    await new Promise(r => setTimeout(r, 1000));
    setStage('dispatching');
    await new Promise(r => setTimeout(r, 1500));
    setStage('delivered');
  };

  const stageProgress = { compose: 0, preparing: 33, dispatching: 66, delivered: 100 };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={stage === 'compose' ? onClose : undefined} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-lg bg-navy-800 border border-slate-700/50 rounded-xl shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/50 bg-navy-900/50">
          <div className="flex items-center gap-2">
            <Zap size={15} className="text-red-400" />
            <span className="font-mono font-bold text-white">ALERT DISPATCH</span>
          </div>
          {stage === 'compose' && (
            <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={16} /></button>
          )}
        </div>

        <div className="p-6 space-y-5">
          {/* Progress */}
          {stage !== 'compose' && (
            <div>
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mb-2">
                {['PREPARING', 'DISPATCHING', 'DELIVERED'].map((s, i) => (
                  <span key={s} className={stageProgress[stage] > i * 33 ? 'text-cyan-400 font-bold' : ''}>{s}</span>
                ))}
              </div>
              <div className="h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                <motion.div
                  animate={{ width: `${stageProgress[stage]}%` }}
                  transition={{ duration: 0.8 }}
                  className={`h-full rounded-full ${stage === 'delivered' ? 'bg-green-400' : 'bg-cyan-400'}`}
                />
              </div>
            </div>
          )}

          {stage === 'compose' && (
            <>
              {/* Alert preview */}
              <div className="p-4 rounded bg-red-500/10 border border-red-500/25">
                <div className="text-[10px] font-mono text-red-400 font-bold tracking-widest mb-2">ALERT PREVIEW</div>
                <div className="text-sm text-white font-mono font-bold">🚨 SURYAKAVACH ALERT</div>
                <div className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                  G4 Geomagnetic Storm · T−42 MIN<br />
                  {substation ? `${substation.name} GVI: ${substation.gvi}/100 [CRITICAL]` : 'Critical Grid Alert — North India'}<br />
                  Estimated GIC: {substation?.estimatedGIC || 142} A<br />
                  Action required: Reduce load, monitor neutral current
                </div>
              </div>

              {/* Recipients */}
              <div>
                <div className="text-[10px] font-mono text-slate-500 tracking-widest mb-2">RECIPIENTS</div>
                <div className="space-y-2">
                  {RECIPIENTS.map(r => (
                    <button
                      key={r.id}
                      onClick={() => toggle(selectedRecipients, setSelectedRecipients, r.id)}
                      className={`w-full flex items-center gap-3 p-2.5 rounded border text-left transition-all ${selectedRecipients.includes(r.id) ? 'border-cyan-500/40 bg-cyan-500/10' : 'border-slate-700/40 hover:border-slate-600'}`}
                    >
                      <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 ${selectedRecipients.includes(r.id) ? 'bg-cyan-500 border-cyan-400' : 'border border-slate-600'}`}>
                        {selectedRecipients.includes(r.id) && <Check size={10} className="text-navy-900" />}
                      </div>
                      <div>
                        <div className="text-xs text-white font-medium">{r.label}</div>
                        <div className="text-[10px] text-slate-500">{r.dept}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Channels */}
              <div>
                <div className="text-[10px] font-mono text-slate-500 tracking-widest mb-2">CHANNELS</div>
                <div className="flex gap-2">
                  {CHANNELS.map(c => (
                    <button
                      key={c.id}
                      onClick={() => toggle(selectedChannels, setSelectedChannels, c.id)}
                      className={`flex-1 flex items-center gap-2 justify-center p-2.5 rounded border text-xs font-mono font-bold transition-all ${selectedChannels.includes(c.id) ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300' : 'border-slate-700/40 text-slate-500 hover:border-slate-600'}`}
                    >
                      <span>{c.icon}</span>{c.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleDispatch}
                className="w-full flex items-center justify-center gap-2 py-3 bg-red-500 hover:bg-red-400 text-white font-bold text-sm font-mono rounded transition-all"
              >
                <Send size={14} /> SEND OPERATOR ALERT
              </button>
            </>
          )}

          {(stage === 'preparing' || stage === 'dispatching') && (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-4">
                <Loader size={24} className="text-cyan-400 animate-spin" />
              </div>
              <div className="font-mono font-bold text-white text-lg">
                {stage === 'preparing' ? 'PREPARING DISPATCH...' : 'DISPATCHING ALERTS...'}
              </div>
              <div className="text-slate-400 text-sm mt-2">
                {stage === 'preparing'
                  ? `Formatting alert for ${selectedRecipients.length} recipients`
                  : `Sending via ${selectedChannels.join(', ').toUpperCase()}`}
              </div>
              <div className="flex justify-center gap-2 mt-4">
                {selectedChannels.map((c, i) => (
                  <motion.div
                    key={c}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, delay: i * 0.3, repeat: Infinity }}
                    className="px-3 py-1 rounded border border-cyan-500/30 text-xs font-mono text-cyan-400"
                  >
                    {c.toUpperCase()}
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {stage === 'delivered' && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 12 }}
                className="w-20 h-20 mx-auto rounded-full bg-green-500/20 border-2 border-green-500/50 flex items-center justify-center mb-4"
              >
                <Check size={32} className="text-green-400" />
              </motion.div>
              <div className="font-mono font-bold text-green-300 text-xl mb-1">✓ ALERT DELIVERED</div>
              <div className="text-slate-400 text-sm">
                {selectedRecipients.length} recipients · {selectedChannels.join(', ').toUpperCase()}
              </div>
              <div className="mt-4 space-y-2">
                {RECIPIENTS.filter(r => selectedRecipients.includes(r.id)).map((r, i) => (
                  <motion.div
                    key={r.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.15 }}
                    className="flex items-center gap-2 px-4 py-2 rounded bg-green-500/10 border border-green-500/20 text-left"
                  >
                    <Check size={12} className="text-green-400 flex-shrink-0" />
                    <span className="text-xs text-slate-300">{r.label}</span>
                    <span className="ml-auto text-[10px] font-mono text-green-400">DELIVERED</span>
                  </motion.div>
                ))}
              </div>
              <button onClick={onClose} className="btn-primary mt-5 px-8">CLOSE</button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
