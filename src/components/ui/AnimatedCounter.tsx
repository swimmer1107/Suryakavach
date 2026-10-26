import React, { useEffect, useRef, useState } from 'react';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  decimals?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value, duration = 1200, decimals = 0, className = '', prefix = '', suffix = ''
}) => {
  const [current, setCurrent] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const startValueRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    startValueRef.current = current;
    startTimeRef.current = null;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const newValue = startValueRef.current + (value - startValueRef.current) * eased;
      setCurrent(newValue);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [value, duration]);

  return (
    <span className={className}>
      {prefix}{current.toFixed(decimals)}{suffix}
    </span>
  );
};
