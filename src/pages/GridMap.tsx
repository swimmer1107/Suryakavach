import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Polyline, useMap } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import { Map, Layers, ZoomIn, ZoomOut, ArrowRight } from 'lucide-react';
import { substations } from '../data/substations';
import { RiskBadge } from '../components/ui/RiskBadge';
import { GVIIndicator } from '../components/ui/GVIIndicator';
import { StatusBadge } from '../components/ui/StatusBadge';
import { MitigationModal } from '../components/MitigationModal';
import { motion, AnimatePresence } from 'framer-motion';
import type { Substation } from '../types';

const STATUS_COLOR: Record<string, string> = {
  critical: '#ef4444',
  high: '#f97316',
  moderate: '#eab308',
  safe: '#22c55e',
};

const TRANSMISSION_LINES: [number, number][][] = [
  [[28.34, 77.31], [27.18, 78.02]],
  [[27.18, 78.02], [27.49, 77.67]],
  [[28.34, 77.31], [28.46, 77.03]],
  [[26.92, 75.79], [28.01, 73.31]],
  [[26.92, 75.79], [27.56, 76.62]],
  [[27.56, 76.62], [28.01, 73.31]],
  [[26.92, 75.79], [25.18, 75.85]],
  [[25.18, 75.85], [26.29, 73.02]],
  [[26.85, 80.95], [26.46, 80.33]],
  [[26.46, 80.33], [27.18, 78.02]],
  [[26.85, 80.95], [25.32, 82.97]],
  [[30.74, 76.79], [31.63, 74.87]],
  [[30.74, 76.79], [30.90, 75.85]],
  [[30.90, 75.85], [31.63, 74.87]],
  [[23.03, 72.59], [21.17, 72.83]],
  [[23.03, 72.59], [22.72, 75.86]],
  [[22.72, 75.86], [23.26, 77.41]],
  [[23.26, 77.41], [22.57, 88.36]],
  [[19.08, 73.07], [18.52, 73.86]],
  [[17.39, 78.49], [12.97, 77.59]],
  [[13.08, 80.27], [12.97, 77.59]],
  [[28.98, 77.71], [30.32, 78.03]],
  [[28.98, 77.71], [28.46, 77.03]],
  [[25.60, 85.10], [22.57, 88.36]],
];

function MapLegend() {
  return (
    <div className="absolute bottom-6 left-4 z-[1000] bg-navy-800/95 border border-slate-700/50 rounded-lg p-3 backdrop-blur-sm">
      <div className="text-[9px] font-mono text-slate-500 tracking-widest mb-2">GVI RISK LEVEL</div>
      {[
        { label: 'CRITICAL (76–100)', color: '#ef4444' },
        { label: 'HIGH (51–75)', color: '#f97316' },
        { label: 'MODERATE (26–50)', color: '#eab308' },
        { label: 'SAFE (0–25)', color: '#22c55e' },
      ].map(item => (
        <div key={item.label} className="flex items-center gap-2 mb-1.5 last:mb-0">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color, boxShadow: `0 0 6px ${item.color}80` }} />
          <span className="text-[10px] font-mono text-slate-400">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

export const GridMap: React.FC = () => {
  const navigate = useNavigate();
  const [selectedSub, setSelectedSub] = useState<Substation | null>(null);
  const [showMitigation, setShowMitigation] = useState(false);
  const [showLines, setShowLines] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | string>('all');
  const [pulse, setPulse] = useState(true);

  useEffect(() => {
    const t = setInterval(() => setPulse(p => !p), 1500);
    return () => clearInterval(t);
  }, []);

  const visibleSubs = filterStatus === 'all' ? substations : substations.filter(s => s.status === filterStatus);
  const criticalCount = substations.filter(s => s.status === 'critical').length;
  const highCount = substations.filter(s => s.status === 'high').length;

  const getRadius = (sub: Substation) => {
    if (sub.status === 'critical') return pulse ? 10 : 8;
    if (sub.status === 'high') return 8;
    if (sub.status === 'moderate') return 6;
    return 5;
  };

  return (
    <div className="flex" style={{ height: 'calc(100vh - 57px)' }}>
      {/* Map */}
      <div className="flex-1 relative">
        <MapContainer
          center={[22.5, 78.9]}
          zoom={5}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution=""
            className="dark-tiles"
          />

          {/* Transmission Lines */}
          {showLines && TRANSMISSION_LINES.map((line, i) => (
            <Polyline
              key={i}
              positions={line}
              pathOptions={{
                color: 'rgba(34, 211, 238, 0.25)',
                weight: 1,
                dashArray: '4 4',
              }}
            />
          ))}

          {/* Substations */}
          {visibleSubs.map(sub => (
            <CircleMarker
              key={sub.id}
              center={[sub.latitude, sub.longitude]}
              radius={getRadius(sub)}
              pathOptions={{
                color: STATUS_COLOR[sub.status],
                fillColor: STATUS_COLOR[sub.status],
                fillOpacity: sub.status === 'critical' ? (pulse ? 0.9 : 0.6) : 0.7,
                weight: sub.status === 'critical' ? 2 : 1,
              }}
              eventHandlers={{ click: () => setSelectedSub(sub) }}
            >
              <Popup>
                <div className="text-xs">
                  <div className="font-bold text-white mb-1">{sub.name}</div>
                  <div className="text-slate-400">GVI: <span className="text-white font-mono">{sub.gvi}</span></div>
                  <div className="text-slate-400">GIC: <span className="text-white font-mono">{sub.estimatedGIC} A</span></div>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>

        {/* Map Legend */}
        <MapLegend />

        {/* Top overlay stats */}
        <div className="absolute top-4 left-4 z-[1000] flex items-center gap-2">
          <div className="bg-navy-800/95 border border-red-500/30 rounded px-3 py-1.5 backdrop-blur-sm">
            <span className="text-[10px] font-mono text-red-400 font-bold">CRITICAL: {criticalCount}</span>
          </div>
          <div className="bg-navy-800/95 border border-orange-500/30 rounded px-3 py-1.5 backdrop-blur-sm">
            <span className="text-[10px] font-mono text-orange-400 font-bold">HIGH: {highCount}</span>
          </div>
          <div className="bg-navy-800/95 border border-slate-700/50 rounded px-3 py-1.5 backdrop-blur-sm flex items-center gap-2">
            <StatusBadge status="live" />
            <span className="text-[10px] font-mono text-slate-400">{substations.length} SUBSTATIONS</span>
          </div>
        </div>

        {/* Layer controls */}
        <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
          <button
            onClick={() => setShowLines(!showLines)}
            className={`px-3 py-1.5 rounded text-[10px] font-mono font-bold transition-all backdrop-blur-sm ${showLines ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300' : 'bg-navy-800/95 border border-slate-700/50 text-slate-400'}`}
          >
            TX LINES
          </button>
          {['all', 'critical', 'high', 'moderate', 'safe'].map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded text-[10px] font-mono font-bold transition-all backdrop-blur-sm ${filterStatus === s ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300' : 'bg-navy-800/90 border border-slate-700/50 text-slate-400 hover:text-white'}`}
            >
              {s.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Side Panel */}
      <AnimatePresence>
        {selectedSub && (
          <motion.div
            initial={{ x: 320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 320, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="w-72 bg-navy-800 border-l border-slate-700/50 flex flex-col overflow-y-auto"
          >
            <div className="p-4 border-b border-slate-700/50 flex items-start justify-between">
              <div>
                <div className="font-display font-bold text-white text-sm">{selectedSub.name}</div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">{selectedSub.city}, {selectedSub.state}</div>
              </div>
              <button onClick={() => setSelectedSub(null)} className="text-slate-500 hover:text-white text-lg leading-none">&times;</button>
            </div>

            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <GVIIndicator gvi={selectedSub.gvi} size="md" />
                <div className="text-right">
                  <RiskBadge level={selectedSub.status} size="md" showDot />
                  <div className="text-[10px] text-slate-500 font-mono mt-1">{selectedSub.voltageLevel} kV</div>
                </div>
              </div>

              <div className="space-y-2">
                {[
                  { label: 'ESTIMATED GIC', val: `${selectedSub.estimatedGIC} A`, color: selectedSub.estimatedGIC > 100 ? 'text-red-400' : 'text-orange-400' },
                  { label: 'TRANSFORMER AGE', val: `${selectedSub.transformerAge} yrs`, color: 'text-slate-300' },
                  { label: 'CURRENT LOAD', val: `${selectedSub.load}%`, color: selectedSub.load > 85 ? 'text-red-400' : 'text-orange-400' },
                  { label: 'TX EXPOSURE', val: selectedSub.transmissionExposure.replace('_', ' ').toUpperCase(), color: 'text-slate-300' },
                  { label: 'LATITUDE', val: `${selectedSub.latitude.toFixed(2)}°N`, color: 'text-cyan-400' },
                ].map(item => (
                  <div key={item.label} className="flex justify-between py-1.5 border-b border-slate-700/20 last:border-0">
                    <span className="text-[10px] font-mono text-slate-500">{item.label}</span>
                    <span className={`text-xs font-mono font-bold ${item.color}`}>{item.val}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => navigate(`/substations/${selectedSub.id}`)}
                  className="w-full flex items-center justify-center gap-2 py-2 bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold rounded transition-all"
                >
                  VIEW DETAILS <ArrowRight size={12} />
                </button>
                <button
                  onClick={() => setShowMitigation(true)}
                  className="w-full flex items-center justify-center gap-2 py-2 bg-slate-700/40 hover:bg-slate-700/60 border border-slate-600/50 text-slate-300 text-xs font-mono font-bold rounded transition-all"
                >
                  SIMULATE MITIGATION
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {showMitigation && selectedSub && (
        <MitigationModal substation={selectedSub} onClose={() => setShowMitigation(false)} />
      )}
    </div>
  );
};
