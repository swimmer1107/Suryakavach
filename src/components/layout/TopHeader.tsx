import React, { useState, useRef, useEffect } from 'react';
import { Bell, Search, User, Zap, ChevronDown, X, LogOut } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { substations } from '../../data/substations';
import { motion, AnimatePresence } from 'framer-motion';

export const TopHeader: React.FC = () => {
  const { liveTime, unreadCount, notifications, markNotificationRead, isReplayMode, storm, setUser, searchQuery, setSearchQuery } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchResults, setSearchResults] = useState<typeof substations>([]);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLInputElement>(null);

  const timeStr = liveTime.toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'Asia/Kolkata'
  });

  useEffect(() => {
    if (searchQuery.length > 1) {
      const q = searchQuery.toLowerCase();
      const results = substations.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q) ||
        s.state.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q)
      ).slice(0, 6);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleSearchSelect = (id: string) => {
    navigate(`/substations/${id}`);
    setSearchQuery('');
    setShowSearch(false);
  };

  const notifColor = {
    critical: 'text-red-400',
    high: 'text-orange-400',
    moderate: 'text-yellow-400',
    system: 'text-blue-400',
    info: 'text-cyan-400',
  };

  return (
    <header className="h-14 bg-navy-900 border-b border-slate-700/50 flex items-center px-4 gap-4 flex-shrink-0 relative z-30">
      {/* Left: Status indicators */}
      <div className="flex items-center gap-4 flex-1">
        {isReplayMode ? (
          <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-blue-500/20 border border-blue-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-blue-400 text-[11px] font-mono font-bold tracking-widest">🔵 REPLAY MODE</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-green-500/10 border border-green-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400 text-[11px] font-mono font-bold tracking-widest">LIVE</span>
          </div>
        )}

        <div className="hidden sm:flex items-center gap-1.5">
          <Zap size={11} className="text-yellow-400" />
          <span className="text-[11px] font-mono text-slate-400">{storm.severity}</span>
          <span className="text-slate-600">·</span>
          <span className="text-[11px] font-mono text-red-400 font-bold">T−42 MIN</span>
        </div>

        <div className="hidden md:flex items-center gap-1.5">
          <span className="text-[11px] font-mono text-slate-500 tracking-wider">SYSTEM</span>
          <span className="text-[11px] font-mono text-green-400 font-semibold">OPERATIONAL</span>
        </div>
      </div>

      {/* Center: Time */}
      <div className="text-center">
        <div className="font-mono text-sm text-white font-semibold tracking-wider">{timeStr}</div>
        <div className="text-[9px] text-slate-500 font-mono tracking-widest">IST</div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 flex-1 justify-end">
        {/* Search */}
        <div className="relative">
          <button
            onClick={() => { setShowSearch(!showSearch); setShowNotifications(false); setShowProfile(false); setTimeout(() => searchRef.current?.focus(), 100); }}
            className="p-2 rounded text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all"
          >
            <Search size={15} />
          </button>

          <AnimatePresence>
            {showSearch && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                className="absolute right-0 top-10 w-72 bg-navy-800 border border-slate-700/50 rounded-lg shadow-2xl overflow-hidden z-50"
              >
                <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-700/50">
                  <Search size={13} className="text-slate-400" />
                  <input
                    ref={searchRef}
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search substations, cities..."
                    className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 outline-none font-mono"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="text-slate-500 hover:text-white">
                      <X size={12} />
                    </button>
                  )}
                </div>
                {searchResults.length > 0 ? (
                  <div className="divide-y divide-slate-700/30">
                    {searchResults.map(s => (
                      <button
                        key={s.id}
                        onClick={() => handleSearchSelect(s.id)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-700/40 transition-all text-left"
                      >
                        <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${s.status === 'critical' ? 'bg-red-400' : s.status === 'high' ? 'bg-orange-400' : s.status === 'moderate' ? 'bg-yellow-400' : 'bg-green-400'}`} />
                        <div>
                          <div className="text-xs text-white font-medium">{s.name}</div>
                          <div className="text-[10px] text-slate-500">{s.city}, {s.state}</div>
                        </div>
                        <div className="ml-auto text-[10px] font-mono text-slate-400">GVI {s.gvi}</div>
                      </button>
                    ))}
                  </div>
                ) : searchQuery.length > 1 ? (
                  <div className="px-3 py-4 text-center text-xs text-slate-500">No results found</div>
                ) : (
                  <div className="px-3 py-3 text-[10px] text-slate-500 font-mono">
                    Search: Agra, Delhi, Jaipur, Bikaner...
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setShowNotifications(!showNotifications); setShowSearch(false); setShowProfile(false); }}
            className="relative p-2 rounded text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all"
          >
            <Bell size={15} />
            {unreadCount > 0 && (
              <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="absolute right-0 top-10 w-80 bg-navy-800 border border-slate-700/50 rounded-lg shadow-2xl overflow-hidden z-50"
              >
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-700/50">
                  <span className="text-xs font-mono font-bold text-white tracking-wider">NOTIFICATIONS</span>
                  <span className="text-[10px] font-mono text-cyan-400">{unreadCount} UNREAD</span>
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-700/30">
                  {notifications.map(n => (
                    <button
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`w-full flex items-start gap-3 px-4 py-3 hover:bg-slate-700/30 transition-all text-left ${!n.read ? 'bg-slate-700/20' : ''}`}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${!n.read ? (notifColor[n.type] || 'text-cyan-400').replace('text-', 'bg-') : 'bg-slate-600'}`} />
                      <div className="flex-1 min-w-0">
                        <div className={`text-xs font-medium ${!n.read ? 'text-white' : 'text-slate-400'}`}>{n.title}</div>
                        <div className="text-[10px] text-slate-500 truncate">{n.message}</div>
                        <div className="text-[9px] text-slate-600 mt-0.5 font-mono">
                          {new Date(n.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} IST
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); setShowSearch(false); }}
            className="flex items-center gap-2 px-3 py-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all"
          >
            <div className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
              <User size={12} className="text-cyan-400" />
            </div>
            <span className="hidden md:block text-xs font-medium text-slate-300">Operator</span>
            <ChevronDown size={11} className="hidden md:block" />
          </button>

          <AnimatePresence>
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="absolute right-0 top-10 w-52 bg-navy-800 border border-slate-700/50 rounded-lg shadow-2xl overflow-hidden z-50"
              >
                <div className="px-4 py-3 border-b border-slate-700/50">
                  <div className="text-xs font-semibold text-white">Grid Operator</div>
                  <div className="text-[10px] text-slate-400 font-mono">operator@powergrid.in</div>
                  <div className="text-[10px] text-cyan-400 font-mono mt-0.5">GRID_OPERATOR · Northern Region</div>
                </div>
                <div className="p-2">
                  <button
                    onClick={() => { setUser(null); navigate('/login'); }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all text-xs"
                  >
                    <LogOut size={13} />
                    Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Click-away to close dropdowns */}
      {(showNotifications || showSearch || showProfile) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => { setShowNotifications(false); setShowSearch(false); setShowProfile(false); }}
        />
      )}
    </header>
  );
};
