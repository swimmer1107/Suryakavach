import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Shield, Eye, EyeOff, Zap, Activity, ArrowRight, Lock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('operator@powergrid.in');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setUser, setDemoMode } = useApp();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  useEffect(() => {
    if (params.get('demo') === 'true') handleDemo();
  }, []);

  const handleLogin = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError('');
    if (!email) { setError('Email is required'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    if (email === 'operator@powergrid.in' || email === 'admin@powergrid.in') {
      setUser({
        id: 'usr-001',
        name: 'Grid Operator',
        email,
        role: email.startsWith('admin') ? 'ADMIN' : 'GRID_OPERATOR',
        region: 'Northern',
      });
      navigate('/dashboard');
    } else {
      setError('Invalid credentials. Use operator@powergrid.in');
    }
    setLoading(false);
  };

  const handleDemo = () => {
    setUser({ id: 'demo-001', name: 'Demo User', email: 'demo@suryakavach.in', role: 'GRID_OPERATOR', region: 'Northern' });
    setDemoMode(true);
    navigate('/dashboard');
  };

  // Animated solar wind values for left panel
  const [liveValues, setLiveValues] = useState({ speed: 742, bz: -18.4, kp: 7.2 });
  useEffect(() => {
    const t = setInterval(() => {
      setLiveValues(v => ({
        speed: v.speed + (Math.random() - 0.5) * 8,
        bz: v.bz + (Math.random() - 0.5) * 0.6,
        kp: Math.min(9, Math.max(0, v.kp + (Math.random() - 0.5) * 0.2)),
      }));
    }, 2000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen flex bg-navy-950">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col flex-1 relative overflow-hidden bg-navy-900 grid-bg">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

        {/* Solar orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-64 h-64 rounded-full bg-orange-500/5 border border-orange-500/10 animate-pulse-slow" />
          <div className="absolute inset-8 rounded-full bg-orange-400/8 border border-orange-400/15 animate-pulse-slow" style={{ animationDelay: '1s' }} />
          <div className="absolute inset-16 rounded-full bg-yellow-400/10 border border-yellow-400/20 animate-pulse-slow" style={{ animationDelay: '2s' }} />
          <div className="absolute inset-24 rounded-full bg-yellow-300/15 border border-yellow-300/30 flex items-center justify-center">
            <Zap size={20} className="text-yellow-400" />
          </div>
          {/* Orbit rings */}
          {[120, 160, 200].map((r, i) => (
            <div key={i} className="absolute border border-cyan-500/10 rounded-full"
              style={{ width: r * 2, height: r * 2, top: 128 - r, left: 128 - r, animationDuration: `${8 + i * 4}s` }} />
          ))}
        </div>

        <div className="relative z-10 p-10 flex flex-col h-full">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
              <Shield size={18} className="text-cyan-400" />
            </div>
            <div>
              <div className="font-display font-bold text-white tracking-wider text-lg">SURYA<span className="text-cyan-400">KAVACH</span></div>
              <div className="text-[9px] text-slate-500 font-mono tracking-widest">SPACE WEATHER → GRID INTELLIGENCE</div>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center max-w-sm">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <h2 className="font-display font-bold text-3xl text-white leading-tight mb-3">
                Some watch the sky.<br />
                <span className="text-cyan-400">We shield the grid.</span>
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Predicting where solar storms impact India's power grid — before they arrive.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-8 grid grid-cols-3 gap-3"
            >
              {[
                { label: 'SOLAR WIND', value: `${liveValues.speed.toFixed(0)}`, unit: 'km/s', color: 'text-cyan-400' },
                { label: 'Bz', value: `${liveValues.bz.toFixed(1)}`, unit: 'nT', color: 'text-red-400' },
                { label: 'Kp INDEX', value: `${liveValues.kp.toFixed(1)}`, unit: '', color: 'text-orange-400' },
              ].map(m => (
                <div key={m.label} className="p-3 card border-slate-700/40 text-center">
                  <div className="text-[9px] font-mono text-slate-500 tracking-widest mb-1">{m.label}</div>
                  <div className={`font-mono font-bold text-lg ${m.color}`}>{m.value}</div>
                  <div className="text-[9px] text-slate-600 font-mono">{m.unit}</div>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-4 p-3 rounded bg-red-500/10 border border-red-500/20 flex items-center gap-3"
            >
              <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse flex-shrink-0" />
              <div>
                <div className="text-red-300 text-xs font-mono font-bold tracking-wider">G4 STORM ACTIVE</div>
                <div className="text-slate-400 text-[10px]">CME arrival in 42 minutes · 8 critical substations</div>
              </div>
            </motion.div>
          </div>

          <div className="text-[10px] text-slate-600 font-mono">
            PROTOTYPE · Data: NOAA · NASA · ISRO
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex flex-col w-full lg:w-[440px] flex-shrink-0 bg-navy-950 p-8 md:p-12 justify-center">
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-8">
            <Shield size={20} className="text-cyan-400" />
            <span className="font-display font-bold text-white tracking-wider">SURYA<span className="text-cyan-400">KAVACH</span></span>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <Lock size={14} className="text-slate-500" />
              <span className="text-xs font-mono text-slate-500 tracking-widest uppercase">Control Room Access</span>
            </div>
            <h1 className="font-display font-bold text-2xl text-white">Sign In</h1>
            <p className="text-slate-500 text-sm mt-1">Access the SuryaKavach command center</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 tracking-wider mb-1.5 uppercase">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-navy-800 border border-slate-700/50 hover:border-slate-600/80 focus:border-cyan-500/60 rounded px-3 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition-all font-mono"
                placeholder="operator@powergrid.in"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 tracking-wider mb-1.5 uppercase">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-navy-800 border border-slate-700/50 hover:border-slate-600/80 focus:border-cyan-500/60 rounded px-3 py-2.5 pr-10 text-sm text-white placeholder-slate-600 outline-none transition-all font-mono"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-slate-600 bg-navy-800 accent-cyan-500"
                />
                <span className="text-xs text-slate-400">Remember me</span>
              </label>
              <span className="text-xs text-slate-500 font-mono">PROTOTYPE AUTH</span>
            </div>

            {error && (
              <div className="p-3 rounded bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-mono">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-cyan-500 hover:bg-cyan-400 disabled:bg-cyan-500/50 text-navy-950 font-bold text-sm font-mono tracking-wider rounded transition-all"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-navy-900/50 border-t-navy-900 rounded-full animate-spin" />
                  AUTHENTICATING...
                </>
              ) : (
                <>SIGN IN <ArrowRight size={14} /></>
              )}
            </button>
          </form>

          <div className="mt-4">
            <div className="relative flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-slate-700/50" />
              <span className="text-xs text-slate-600 font-mono">OR</span>
              <div className="flex-1 h-px bg-slate-700/50" />
            </div>

            <button
              onClick={handleDemo}
              className="w-full flex items-center justify-center gap-2 py-2.5 border border-purple-500/40 hover:border-purple-500/70 bg-purple-500/10 hover:bg-purple-500/15 text-purple-300 text-sm font-mono font-semibold rounded transition-all"
            >
              <Activity size={14} />
              ENTER DEMO MODE
            </button>
          </div>

          <div className="mt-6 p-3 rounded bg-slate-700/20 border border-slate-700/30">
            <div className="text-[10px] font-mono text-slate-500 mb-1 font-bold tracking-wider">DEMO CREDENTIALS</div>
            <div className="text-[11px] text-slate-400 font-mono">operator@powergrid.in · any password</div>
            <div className="text-[11px] text-slate-400 font-mono">admin@powergrid.in · for admin access</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
