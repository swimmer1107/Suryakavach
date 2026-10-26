import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Zap, Activity, Map, Building2, BarChart3,
  Bell, Wrench, Clock, LineChart, Database, Server, Settings,
  ChevronLeft, ChevronRight, Shield, Sun, TrendingUp
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    title: 'COMMAND CENTER',
    items: [
      { label: 'Dashboard', icon: <LayoutDashboard size={15} />, path: '/dashboard' },
    ],
  },
  {
    title: 'SPACE WEATHER',
    items: [
      { label: 'Storm Intelligence', icon: <Activity size={15} />, path: '/storm-intelligence' },
      { label: 'CME Prediction', icon: <Sun size={15} />, path: '/prediction' },
    ],
  },
  {
    title: 'GRID INTELLIGENCE',
    items: [
      { label: 'India Grid Map', icon: <Map size={15} />, path: '/grid-map' },
      { label: 'Substations', icon: <Building2 size={15} />, path: '/substations' },
      { label: 'GVI Analysis', icon: <BarChart3 size={15} />, path: '/analytics/gvi' },
    ],
  },
  {
    title: 'RESPONSE',
    items: [
      { label: 'Alerts', icon: <Bell size={15} />, path: '/alerts' },
      { label: 'Mitigation Simulator', icon: <Wrench size={15} />, path: '/mitigation' },
    ],
  },
  {
    title: 'HISTORICAL',
    items: [
      { label: 'Storm Replay', icon: <Clock size={15} />, path: '/replay' },
      { label: 'Analytics', icon: <TrendingUp size={15} />, path: '/analytics' },
    ],
  },
  {
    title: 'SYSTEM',
    items: [
      { label: 'Data Sources', icon: <Database size={15} />, path: '/data-sources' },
      { label: 'System Health', icon: <Server size={15} />, path: '/system-health' },
      { label: 'Settings', icon: <Settings size={15} />, path: '/settings' },
    ],
  },
];

export const Sidebar: React.FC = () => {
  const { sidebarCollapsed, setSidebarCollapsed, isReplayMode } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarCollapsed ? 56 : 220 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="relative flex flex-col bg-navy-900 border-r border-slate-700/50 h-screen flex-shrink-0 overflow-hidden"
      style={{ minWidth: sidebarCollapsed ? 56 : 220 }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-4 border-b border-slate-700/50 min-h-[57px]">
        <div className="w-7 h-7 rounded bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center flex-shrink-0">
          <Shield size={14} className="text-cyan-400" />
        </div>
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="font-display font-bold text-sm text-white tracking-wider leading-tight">SURYA<span className="text-cyan-400">KAVACH</span></div>
              <div className="text-[9px] text-slate-500 font-mono tracking-widest">SPACE WEATHER → GRID</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Replay mode indicator */}
      {isReplayMode && !sidebarCollapsed && (
        <div className="mx-3 mt-2 px-2 py-1.5 rounded bg-blue-500/15 border border-blue-500/30 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          <span className="text-blue-400 text-[10px] font-mono font-bold tracking-widest">REPLAY MODE</span>
        </div>
      )}

      {/* Nav Groups */}
      <nav className="flex-1 overflow-y-auto py-3 space-y-4 px-2">
        {navGroups.map((group) => (
          <div key={group.title}>
            {!sidebarCollapsed && (
              <div className="px-2 mb-1">
                <span className="text-[9px] font-mono font-bold tracking-widest text-slate-600 uppercase">{group.title}</span>
              </div>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = location.pathname === item.path || 
                  (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    title={sidebarCollapsed ? item.label : undefined}
                    className={`w-full text-left transition-all duration-150 rounded
                      ${sidebarCollapsed ? 'flex items-center justify-center p-3' : 'flex items-center gap-2.5 px-3 py-2'}
                      ${isActive
                        ? 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-400'
                        : 'text-slate-400 hover:text-white hover:bg-slate-700/40 border border-transparent'
                      }`}
                  >
                    <span className={`flex-shrink-0 ${isActive ? 'text-cyan-400' : ''}`}>{item.icon}</span>
                    {!sidebarCollapsed && (
                      <span className="text-xs font-medium truncate">{item.label}</span>
                    )}
                    {isActive && !sidebarCollapsed && (
                      <span className="ml-auto w-1 h-1 rounded-full bg-cyan-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="border-t border-slate-700/50 p-3 space-y-2">
        {!sidebarCollapsed && (
          <div className="flex items-center gap-2 px-2 py-1.5 rounded bg-green-500/10 border border-green-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400 text-[10px] font-mono font-semibold tracking-wider">SYSTEM OPERATIONAL</span>
          </div>
        )}
        {!sidebarCollapsed && (
          <div className="px-2">
            <div className="text-[10px] text-slate-500 font-mono">Grid Operator</div>
            <div className="text-xs text-slate-400 font-medium truncate">Northern Region</div>
          </div>
        )}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="w-full flex items-center justify-center p-2 rounded text-slate-500 hover:text-cyan-400 hover:bg-slate-700/40 transition-all"
        >
          {sidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>
    </motion.aside>
  );
};
