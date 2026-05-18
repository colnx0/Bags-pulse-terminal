'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface DataPoint {
  date: string;
  value: number;
}

interface PulseChartProps {
  data: DataPoint[];
  color?: string; // CSS color string, e.g., 'var(--accent-primary)'
  height?: number;
}

export const PulseChart: React.FC<PulseChartProps> = ({ 
  data, 
  color = '#00ffa3', 
  height = 200 
}) => {
  const { pathData, areaData, points } = useMemo(() => {
    if (!data || data.length === 0) return { pathData: '', areaData: '', points: [] };

    const width = 800; // SVG viewBox width
    const minX = 0;
    const maxX = data.length - 1;
    const minY = Math.min(...data.map(d => d.value)) * 0.9; // Add 10% padding below
    const maxY = Math.max(...data.map(d => d.value)) * 1.1; // Add 10% padding above

    const scaleX = (index: number) => (index / maxX) * width;
    const scaleY = (val: number) => {
      const range = maxY - minY;
      if (range === 0) return height / 2;
      return height - ((val - minY) / range) * height;
    };

    const mappedPoints = data.map((d, i) => ({
      x: scaleX(i),
      y: scaleY(d.value),
      value: d.value,
      date: d.date,
    }));

    // Generate SVG path commands (simple lines for now, could be bezier)
    const linePath = mappedPoints.reduce(
      (acc, point, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${point.x},${point.y}`,
      ''
    );

    // Generate area path for the gradient fill
    const area = `${linePath} L ${width},${height} L 0,${height} Z`;

    return { pathData: linePath, areaData: area, points: mappedPoints };
  }, [data, height]);

  if (data.length === 0) return null;

  return (
    <div className="relative w-full h-full min-h-[200px] flex items-end justify-center">
      <svg 
        viewBox={`0 0 800 ${height}`} 
        className="w-full h-full overflow-visible drop-shadow-xl"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.4} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Area fill */}
        <motion.path
          d={areaData}
          fill="url(#chartGradient)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        />

        {/* Line stroke */}
        <motion.path
          d={pathData}
          fill="none"
          stroke={color}
          strokeWidth="3"
          filter="url(#glow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />

        {/* Data points (optional, just dots on the line) */}
        {points.map((p, i) => (
          <motion.circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="4"
            fill={color}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1 + i * 0.05, duration: 0.3 }}
            className="cursor-pointer hover:r-6 transition-all"
          />
        ))}
      </svg>
      
      {/* Simple overlay for neon effect */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/40 to-transparent" />
    </div>
  );
};
