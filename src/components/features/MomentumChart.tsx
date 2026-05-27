'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TEAMS } from '@/constants';
import type { TeamCode } from '@/types';

interface MomentumDataPoint {
  teamCode: TeamCode;
  momentum: number;
  timestamp: number;
}

interface MomentumChartProps {
  data: MomentumDataPoint[];
  teamCode?: TeamCode;
  height?: number;
}

/**
 * MomentumChart - Sparkline visualization of momentum over time
 * Uses SVG to render a smooth line chart without external dependencies
 */
export function MomentumChart({ data, teamCode, height = 60 }: MomentumChartProps) {
  const filteredData = useMemo(() => {
    if (teamCode) {
      return data.filter((d) => d.teamCode === teamCode);
    }
    return data;
  }, [data, teamCode]);

  if (filteredData.length === 0) {
    return (
      <div className="text-xs text-slate-400">No data available</div>
    );
  }

  // Calculate dimensions
  const width = 300;
  const padding = 4;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  // Get momentum range
  const momenta = filteredData.map((d) => d.momentum);
  const minMomentum = Math.max(0, Math.min(...momenta) - 5);
  const maxMomentum = Math.min(100, Math.max(...momenta) + 5);
  const momentumRange = maxMomentum - minMomentum;

  // Calculate points for SVG path
  const points = filteredData.map((d, i) => {
    const x = padding + (i / (filteredData.length - 1 || 1)) * chartWidth;
    const y = padding + chartHeight - ((d.momentum - minMomentum) / momentumRange) * chartHeight;
    return { x, y, momentum: d.momentum };
  });

  // Create SVG path
  const pathData = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');

  // Current momentum (last point)
  const currentMomentum = filteredData[filteredData.length - 1]?.momentum || 0;
  const previousMomentum = filteredData[filteredData.length - 2]?.momentum || currentMomentum;
  const change = currentMomentum - previousMomentum;
  const isGain = change >= 0;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-xs text-slate-400">{chartWidth > 100 ? 'Momentum Trend' : ''}</span>
        <div className="flex items-center gap-1">
          <span className={`text-sm font-semibold ${isGain ? 'text-accent-emerald' : 'text-accent-red'}`}>
            {currentMomentum.toFixed(1)}%
          </span>
          <span className="text-xs text-slate-500">
            {isGain ? '📈' : '📉'} {isGain ? '+' : ''}{change.toFixed(1)}%
          </span>
        </div>
      </div>

      <svg
        width={width}
        height={height}
        className="w-full"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
      >
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const y = padding + chartHeight * ratio;
          const momentumValue = maxMomentum - (maxMomentum - minMomentum) * ratio;
          return (
            <g key={`grid-${i}`}>
              <line
                x1={padding}
                y1={y}
                x2={width - padding}
                y2={y}
                stroke="rgba(148, 163, 184, 0.1)"
                strokeWidth="0.5"
              />
              {i === 0 || i === 1 ? (
                <text
                  x={width - padding + 2}
                  y={y}
                  fontSize="8"
                  fill="rgba(148, 163, 184, 0.5)"
                  dy="0.3em"
                >
                  {momentumValue.toFixed(0)}%
                </text>
              ) : null}
            </g>
          );
        })}

        {/* Area under curve */}
        <defs>
          <linearGradient id={`momentumGradient-${teamCode}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={isGain ? '#10b981' : '#ef4444'} stopOpacity="0.3" />
            <stop offset="100%" stopColor={isGain ? '#10b981' : '#ef4444'} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Path line */}
        <motion.path
          d={pathData}
          fill="none"
          stroke={isGain ? '#10b981' : '#ef4444'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        />

        {/* Points */}
        {points.map((p, i) => (
          <motion.circle
            key={`point-${i}`}
            cx={p.x}
            cy={p.y}
            r="2"
            fill={isGain ? '#10b981' : '#ef4444'}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 + i * 0.02 }}
          />
        ))}

        {/* Current value indicator */}
        {points.length > 0 && (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <circle
              cx={points[points.length - 1].x}
              cy={points[points.length - 1].y}
              r="3.5"
              fill="none"
              stroke={isGain ? '#10b981' : '#ef4444'}
              strokeWidth="1"
            />
          </motion.g>
        )}
      </svg>
    </div>
  );
}

export default MomentumChart;
