import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Zap, Activity, Map, ArrowRight, ChevronRight, Sun, Radio, Database } from 'lucide-react';
import { motion } from 'framer-motion';

const STATS = [
  { value: '40+', label: 'MIN EARLY WARNING', sub: 'vs. industry avg 8 min' },
  { value: '0–100', label: 'GRID VULNERABILITY INDEX', sub: 'per substation scoring' },
  { value: '±3 HRS', label: 'CME PREDICTION', sub: 'vs. baseline ±10 hrs' },
  { value: '100%', label: 'OPEN DATA', sub: 'NOAA · NASA · ISRO' },
];

const PIPELINE = [
  { icon: <Sun size={18} className="text-orange-400" />, label: 'Solar Storm', sub: 'CME Detection' },
  { icon: <Radio size={18} className="text-cyan-400" />, label: 'AI Prediction', sub: 'Arrival & Intensity' },
  { icon: <Activity size={18} className="text-yellow-400" />, label: 'Grid Risk', sub: 'GVI Computation' },
  { icon: <Zap size={18} className="text-red-400" />, label: 'Operator Alert', sub: 'SMS · WhatsApp · Email' },
];

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [particles, setParticles] = useState<{ x: number; y: number; delay: number; size: number }[]>([]);

  useEffect(() => {
    setParticles(Array.from({ length: 20 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 4,
      size: Math.random() * 2 + 1,
    })));
  }, []);

  return (
    <div className="min-h-screen bg-navy-950 grid-bg overflow-hidden relative">
      <div className="scan-line" />

      {/* Floating particles */}
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-cyan-400/20 animate-pulse-slow"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, animationDelay: `${p.delay}s` }}
        />
      ))}

      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-orange-500/3 blur-3xl pointer-events-none" />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5 border-b border-slate-700/30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
            <Shield size={16} className="text-cyan-400" />
          </div>
          <div>
            <span className="font-display font-bold text-white tracking-wider">SURYA<span className="text-cyan-400">KAVACH</span></span>
            <div className="text-[9px] text-slate-500 font-mono tracking-widest">SPACE WEATHER → GRID INTELLIGENCE</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/login')} className="text-slate-400 hover:text-white text-sm transition-colors font-mono">
            SIGN IN
          </button>
          <button
            onClick={() => navigate('/login')}
            className="btn-primary flex items-center gap-2"
          >
            CONTROL CENTER <ChevronRight size={13} />
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative z-10 max-w-6xl mx-auto px-8 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/15 border border-red-500/30 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            <span className="text-red-300 text-xs font-mono tracking-widest">G4 STORM ACTIVE · T−42 MINUTES</span>
          </div>

          <h1 className="font-display font-bold text-5xl md:text-6xl lg:text-7xl text-white leading-tight mb-4">
            SOME WATCH<br />
            <span className="text-cyan-400">THE SKY.</span><br />
            <span className="text-slate-300">WE SHIELD</span><br />
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">THE GRID.</span>
          </h1>

          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mt-6 leading-relaxed">
            SuryaKavach predicts <span className="text-white">where</span> solar storms could impact India's power grid—<span className="text-cyan-400">before they do.</span>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/login')}
              className="flex items-center gap-3 px-8 py-3.5 bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold text-sm font-mono tracking-wider rounded transition-all"
            >
              ENTER CONTROL CENTER <ArrowRight size={16} />
            </motion.button>
            <button
              onClick={() => navigate('/login?demo=true')}
              className="flex items-center gap-2 px-6 py-3.5 border border-slate-600/60 hover:border-cyan-500/50 text-slate-300 hover:text-white text-sm font-mono tracking-wider rounded transition-all"
            >
              EXPLORE DEMO
            </button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20"
        >
          {STATS.map((s, i) => (
            <div key={i} className="text-center p-5 card border-slate-700/30">
              <div className="font-display font-bold text-2xl text-cyan-400 mb-1">{s.value}</div>
              <div className="text-xs font-mono font-bold text-white tracking-wider mb-1">{s.label}</div>
              <div className="text-[10px] text-slate-500">{s.sub}</div>
            </div>
          ))}
        </motion.div>

        {/* Pipeline */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-24"
        >
          <div className="text-center mb-10">
            <div className="text-xs font-mono font-bold text-slate-500 tracking-widest mb-2">THE PLATFORM</div>
            <h2 className="font-display font-bold text-2xl text-white">Storm → Grid Intelligence Pipeline</h2>
          </div>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {PIPELINE.map((p, i) => (
              <React.Fragment key={i}>
                <div className="flex flex-col items-center gap-2 p-4 card min-w-[120px]">
                  <div className="w-10 h-10 rounded-lg bg-slate-700/50 flex items-center justify-center">
                    {p.icon}
                  </div>
                  <div className="text-xs font-mono font-bold text-white text-center">{p.label}</div>
                  <div className="text-[10px] text-slate-500 text-center">{p.sub}</div>
                </div>
                {i < PIPELINE.length - 1 && (
                  <ChevronRight size={16} className="text-slate-600 flex-shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>
        </motion.div>

        {/* The Key Difference */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="mt-24 grid md:grid-cols-2 gap-6"
        >
          <div className="card p-6 border-slate-600/30">
            <div className="text-xs font-mono text-slate-500 tracking-widest mb-3">TRADITIONAL SPACE WEATHER</div>
            <div className="text-xl font-display font-bold text-slate-400 line-through">"Storm is coming."</div>
            <p className="text-slate-500 text-sm mt-2">Tells operators when. Operators must figure out the rest.</p>
          </div>
          <div className="card p-6 border-cyan-500/20 shadow-[0_0_20px_rgba(34,211,238,0.05)]">
            <div className="text-xs font-mono text-cyan-400 tracking-widest mb-3">SURYAKAVACH</div>
            <div className="text-xl font-display font-bold text-white">"Storm is coming →<br />These substations are at risk →<br />Here is why → Here's what to do."</div>
            <p className="text-slate-400 text-sm mt-2">Storm → Grid Impact. Per substation. Actionable.</p>
          </div>
        </motion.div>

        {/* Data Sources */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.9 }}
          className="mt-20 text-center"
        >
          <div className="text-xs font-mono text-slate-600 tracking-widest mb-4">POWERED BY OPEN DATA FROM</div>
          <div className="flex items-center justify-center gap-6 flex-wrap">
            {['NOAA SWPC', 'NASA DSCOVR', 'ISRO Aditya-L1', 'Open Data'].map(s => (
              <span key={s} className="text-slate-500 text-sm font-mono font-semibold hover:text-slate-300 transition-colors">
                {s}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-700/30 mt-8 px-8 py-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="font-display font-bold text-white tracking-wider">SURYA<span className="text-cyan-400">KAVACH</span></div>
            <div className="text-xs text-slate-500 mt-0.5 font-mono">Space Weather → Grid Intelligence</div>
            <div className="text-xs text-slate-600 mt-0.5">Built for resilient infrastructure.</div>
          </div>
          <div className="text-center">
            <div className="text-[10px] text-slate-600 font-mono">PROTOTYPE · HACKATHON DEMO · NOT FOR PRODUCTION USE</div>
            <div className="text-[10px] text-slate-600 mt-0.5">Data: NOAA · NASA · ISRO · Simulated Grid Topology</div>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
            <Map size={12} />
            <span>INDIA GRID OPERATIONS</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
