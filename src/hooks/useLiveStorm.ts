import { useState, useEffect } from 'react';
import { currentStorm } from '../data/stormData';

export interface LiveStormValues {
  solarWindSpeed: number;
  bz: number;
  density: number;
  kp: number;
}

export const useLiveStorm = (): LiveStormValues => {
  const [values, setValues] = useState<LiveStormValues>({
    solarWindSpeed: currentStorm.solarWindSpeed,
    bz: currentStorm.bz,
    density: currentStorm.density,
    kp: currentStorm.kp,
  });

  useEffect(() => {
    const t = setInterval(() => {
      setValues(prev => ({
        solarWindSpeed: Math.max(300, prev.solarWindSpeed + (Math.random() - 0.4) * 15),
        bz: Math.min(-1, prev.bz - Math.random() * 0.8),
        density: Math.max(3, prev.density + (Math.random() - 0.5) * 0.6),
        kp: Math.min(9, Math.max(0, prev.kp + (Math.random() - 0.45) * 0.15)),
      }));
    }, 2500);
    return () => clearInterval(t);
  }, []);

  return values;
};
