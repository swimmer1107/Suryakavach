import type { StormData, ChartDataPoint, ReplayScenario, StormTimelineEvent } from '../types';

export const currentStorm: StormData = {
  id: 'storm-2026-gannon2',
  name: 'G4 Geomagnetic Storm',
  kp: 7.2,
  solarWindSpeed: 742,
  bz: -18.4,
  density: 12.8,
  xrayFlux: 'M5.8',
  cmeVelocity: 1847,
  predictedArrival: new Date(Date.now() + 42 * 60000).toISOString(),
  confidence: 87,
  severity: 'G4',
  status: 'approaching',
  earthDirected: true,
};

// Generate realistic solar wind speed data (last 24h)
function generateTimeSeriesData(
  baseValue: number,
  variance: number,
  points: number,
  trend: 'rising' | 'falling' | 'stable' | 'peak'
): ChartDataPoint[] {
  const data: ChartDataPoint[] = [];
  const now = Date.now();
  const interval = (24 * 60 * 60 * 1000) / points;
  
  for (let i = 0; i < points; i++) {
    const t = now - (points - i) * interval;
    const time = new Date(t);
    const timeStr = `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`;
    
    let value: number;
    const progress = i / points;
    
    if (trend === 'rising') {
      value = baseValue + (variance * progress * 1.5) + (Math.random() - 0.5) * variance * 0.3;
    } else if (trend === 'falling') {
      value = baseValue + variance * (1 - progress) + (Math.random() - 0.5) * variance * 0.3;
    } else if (trend === 'peak') {
      const peak = Math.sin(progress * Math.PI);
      value = baseValue + variance * peak + (Math.random() - 0.5) * variance * 0.2;
    } else {
      value = baseValue + (Math.random() - 0.5) * variance;
    }
    
    data.push({ time: timeStr, value: Math.round(value * 10) / 10 });
  }
  return data;
}

export const solarWindData: ChartDataPoint[] = generateTimeSeriesData(450, 350, 48, 'rising');
export const bzData: ChartDataPoint[] = generateTimeSeriesData(-2, 18, 48, 'falling').map(d => ({
  ...d,
  value: -Math.abs(d.value) * (0.5 + Math.random() * 0.5)
}));
export const kpData: ChartDataPoint[] = generateTimeSeriesData(3, 5, 48, 'rising');
export const densityData: ChartDataPoint[] = generateTimeSeriesData(6, 8, 48, 'rising');
export const xrayData: ChartDataPoint[] = generateTimeSeriesData(0.5, 2.5, 48, 'peak');
export const cmeVelocityData: ChartDataPoint[] = generateTimeSeriesData(800, 1100, 24, 'rising');

// Gannon Storm 2024 Replay Timeline
export const gannonStormTimeline: StormTimelineEvent[] = [
  {
    timeOffset: -180,
    label: 'T−180 MIN',
    description: 'Normal solar wind conditions. No CME detected. Grid operating normally.',
    kp: 2.1,
    solarWindSpeed: 380,
    bz: 2.3,
    density: 5.2,
    criticalSubstations: 0,
    highSubstations: 2,
    moderateSubstations: 8,
    safeSubstations: 20,
  },
  {
    timeOffset: -120,
    label: 'T−120 MIN',
    description: 'CME detected at DSCOVR satellite. Earth-directed. SuryaKavach begins analysis.',
    kp: 3.4,
    solarWindSpeed: 520,
    bz: -1.2,
    density: 7.8,
    criticalSubstations: 0,
    highSubstations: 4,
    moderateSubstations: 12,
    safeSubstations: 14,
  },
  {
    timeOffset: -90,
    label: 'T−90 MIN',
    description: 'Solar wind speed increasing rapidly. Bz showing southward trend. Early warning triggered.',
    kp: 5.1,
    solarWindSpeed: 630,
    bz: -6.8,
    density: 10.1,
    criticalSubstations: 2,
    highSubstations: 8,
    moderateSubstations: 12,
    safeSubstations: 8,
  },
  {
    timeOffset: -60,
    label: 'T−60 MIN',
    description: 'Bz firmly southward. Kp exceeding 6. Northern substations showing elevated GVI.',
    kp: 6.4,
    solarWindSpeed: 695,
    bz: -12.6,
    density: 11.9,
    criticalSubstations: 5,
    highSubstations: 10,
    moderateSubstations: 8,
    safeSubstations: 7,
  },
  {
    timeOffset: -42,
    label: 'T−42 MIN',
    description: '🚨 SURYAKAVACH CRITICAL ALERT ISSUED. G4 storm imminent. 8 critical substations identified.',
    kp: 7.2,
    solarWindSpeed: 742,
    bz: -18.4,
    density: 12.8,
    criticalSubstations: 8,
    highSubstations: 11,
    moderateSubstations: 8,
    safeSubstations: 3,
    alertTriggered: true,
  },
  {
    timeOffset: -20,
    label: 'T−20 MIN',
    description: 'High-risk substations identified. Operators receiving automated notifications.',
    kp: 7.8,
    solarWindSpeed: 789,
    bz: -21.2,
    density: 13.5,
    criticalSubstations: 10,
    highSubstations: 12,
    moderateSubstations: 6,
    safeSubstations: 2,
  },
  {
    timeOffset: 0,
    label: 'T0 STORM IMPACT',
    description: 'Peak storm impact. G4 conditions active. Maximum GIC exposure for northern grid.',
    kp: 8.1,
    solarWindSpeed: 812,
    bz: -24.7,
    density: 14.2,
    criticalSubstations: 12,
    highSubstations: 10,
    moderateSubstations: 6,
    safeSubstations: 2,
  },
  {
    timeOffset: 30,
    label: 'T+30 MIN',
    description: 'Storm subsiding. Mitigation actions proving effective. Recovery initiated.',
    kp: 6.2,
    solarWindSpeed: 698,
    bz: -14.3,
    density: 11.2,
    criticalSubstations: 6,
    highSubstations: 9,
    moderateSubstations: 10,
    safeSubstations: 5,
  },
];

export const gannonStormReplay: ReplayScenario = {
  id: 'replay-gannon-2024',
  name: '2024 Gannon Storm',
  year: 2024,
  date: 'May 10–11, 2024',
  description: 'The most powerful geomagnetic storm in 20 years. G5 conditions reached. Named after the small town of Gannon, Minnesota where grid disruptions were reported. This replay demonstrates how SuryaKavach would have provided 42-minute early warning for India\'s grid.',
  maxKp: 8.1,
  maxGVI: 96,
  affectedSubstations: 27,
  criticalSubstations: 12,
  duration: 210,
  timeline: gannonStormTimeline,
};

export const historicalStorms = [
  {
    id: 'storm-1989-quebec',
    name: '1989 Quebec Blackout Storm',
    date: 'March 13, 1989',
    kp: 9.0,
    severity: 'G5',
    description: 'The most catastrophic geomagnetic storm of the modern era. Caused a complete collapse of Hydro-Québec\'s power grid in 92 seconds, leaving 6 million people without power for up to 9 hours.',
    affectedRegion: 'North America (Historical)',
    estimatedIndiaImpact: 'HIGH — Northern grid would face severe GIC stress',
  },
  {
    id: 'storm-2003-halloween',
    name: '2003 Halloween Storm',
    date: 'October 28-29, 2003',
    kp: 8.7,
    severity: 'G5',
    description: 'Series of X-class solar flares. Caused satellite anomalies, power outages in Sweden, and GPS disruptions worldwide.',
    affectedRegion: 'Global',
    estimatedIndiaImpact: 'MODERATE-HIGH — Rajasthan and UP substations at risk',
  },
  {
    id: 'storm-2024-gannon',
    name: '2024 Gannon Storm',
    date: 'May 10-11, 2024',
    kp: 8.1,
    severity: 'G5',
    description: 'First G5 storm since 2003. Visible aurora reported from India for the first time in decades. This replay scenario demonstrates SuryaKavach\'s predictive capability.',
    affectedRegion: 'Global',
    estimatedIndiaImpact: 'CRITICAL — 27 substations affected, 8 critical',
  },
];
